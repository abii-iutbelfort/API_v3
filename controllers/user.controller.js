const {dbAuth} = require("../models");
const { authJwt } = require("../middleware");
const User = dbAuth.users;
const Role = dbAuth.roles;


// Create and Save a new User
exports.create = async (req, res) => {
    // Create a User
    const user = {
        login: req.body.login,
        email: req.body.email,
        password: req.body.password,
        roleId: req.body.roleId
    };

    // Save User in the database
    User.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
};

// Retrieve all Users from the database.
exports.findAll = async (req, res) => {

    User.findAll({include:Role})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Users."
            });
        });
};

// Find a single User with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find User with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User with id=" + id
            });
        });
};

// Update a User by the id in the request
exports.update = async (req, res) => {
    const id = parseInt(req.params.id);

    const newValues = {
        login: req.body.login,
        email: req.body.email,
        password: req.body.password,
        roleId: req.body.roleId
    };

    User.update(newValues, {
        where: { userId: id }
    })
        .then(results => {
            if (results[0] > 0) {

                res.status(200).send({
                    message: "User was updated successfully.", data: results[1]
                });
            } else {
                res.status(404).send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};

// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    User.destroy({
        where: { userId: id }
    })
        .then(num => {
            if (num > 0) {
                res.status(200).send({
                    message: "User was deleted successfully!",
                    
                });
            } else {
                res.status(404).send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};

// Delete all Users from the database.
exports.deleteAll = async (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({ message: `${nums} Users were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Users."
            });
        });
};

