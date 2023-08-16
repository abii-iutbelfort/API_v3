import inquirer from "inquirer";
import { AbiiUsers, sequelize } from "../models/index.js";

async function createAdminUser() {
  try {
    await sequelize.sync({ logging: false });

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "firstname",
        message: "Enter the firstname username of the new abii user :",
      },
      {
        type: "input",
        name: "lastname",
        message: "Enter the lastname username of the new abii user :",
      },
      {
        type: "input",
        name: "login",
        message: "Enter the login username of the new abii user :",
      },
    ]);

    let passwordPrompt = [
      {
        type: "password",
        name: "password",
        message: "Enter the password of the new abii user :",
        mask: "*",
      },
      {
        type: "password",
        name: "passwordConfirmation",
        message: "Confirm the password of the new abii user :",
        mask: "*",
      },
    ];
    let passwordAnswer = await inquirer.prompt(passwordPrompt);

    while (passwordAnswer.password !== passwordAnswer.passwordConfirmation) {
      console.log("Passwords do not match, try again");
      passwordAnswer = await inquirer.prompt(passwordPrompt);
    }

    const { firstname, lastname, login } = answers;
    const { password } = passwordAnswer;
    const adminUserData = {
      firstname,
      lastname,
      login,
      password,
    };

    const adminUser = await AbiiUsers.create(adminUserData);
    console.log("Admin user created:", adminUser.toJSON());
  } catch (error) {
    console.error("Error creating admin user:", error.name);
  } finally {
    sequelize.close();
  }
}

createAdminUser();
