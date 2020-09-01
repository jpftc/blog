// Importando Sequelize
const Sequelize = require("sequelize");
// Importando conexão com o banco de dados
const connection = require("../database/database");

// Criando model tabela users
const User = connection.define("users", {
    email: {
        type: Sequelize.STRING,
        allowNull: false
        // slug = nome separado por "-" e sem acentos
    }, password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Expportando model
module.exports = User;