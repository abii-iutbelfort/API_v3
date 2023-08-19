import loggers from './utils/logger.utils.js';
import fs from 'fs';
import inquirer from 'inquirer';
import bcrypt from 'bcrypt';
import {Sequelize} from 'sequelize';
import {Client} from 'pg';

// Function to create the PostgreSQL user and database using the superuser
async function createPostgresUserAndDatabase(
    superUser,
    superPassword,
    postgresUser,
    postgresPassword,
    databaseName,
) {
  const client = new Client({
    user: superUser,
    password: superPassword,
    database: 'postgres',
  });

  try {
    await client.connect();
    await client.query(
        `CREATE USER ${postgresUser} WITH PASSWORD '${postgresPassword}'`,
    );
    await client.query(`CREATE DATABASE ${databaseName} OWNER ${postgresUser}`);
    await client.end();

    console.log('PostgreSQL user and database created successfully.');
  } catch (error) {
    console.error('Error creating PostgreSQL user and database:', error);
    process.exit(1);
  }
}

// Prompt for PostgreSQL user and database information
async function promptPostgresInfo() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'superUser',
        message: 'Enter the PostgreSQL superuser username (e.g., "postgres"):',
      },
      {
        type: 'password',
        name: 'superPassword',
        message: 'Enter the PostgreSQL superuser password:',
        mask: '*',
      },
      {
        type: 'input',
        name: 'postgresUser',
        message: 'Enter the PostgreSQL username for the new user:',
      },
      {
        type: 'password',
        name: 'postgresPassword',
        message: 'Enter the PostgreSQL password for the new user:',
        mask: '*',
      },
      {
        type: 'input',
        name: 'databaseName',
        message: 'Enter the name of the database:',
      },
    ]);

    // Create the PostgreSQL user and database
    await createPostgresUserAndDatabase(
        answers.superUser,
        answers.superPassword,
        answers.postgresUser,
        answers.postgresPassword,
        answers.databaseName,
    );

    console.log('PostgreSQL user and database created successfully.');
    return answers;
  } catch (error) {
    console.error('Error creating PostgreSQL user and database:', error);
    process.exit(1);
  }
}

// ... Rest of the setup script (defining Sequelize models, creating tables, prompt for admin account)

async function runSetup() {
  try {
    // Prompt for PostgreSQL user and database information
    const postgresInfo = await promptPostgresInfo();

    // Continue with Sequelize setup and admin account creation

    // Update .env file with database configurations
    const envFileContent = `
      DATABASE_URL=postgres://${postgresInfo.postgresUser}:${encodeURIComponent(
    postgresInfo.postgresPassword,
)}@localhost/${postgresInfo.databaseName}
      # Add other environment variables if needed
    `;
    fs.writeFileSync('.env', envFileContent);

    console.log('Setup completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

runSetup();
