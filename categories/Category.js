// Importando Sequelize
const Sequelize = require("sequelize");
// Importando conexão com o banco de dados
const connection = require("../database/database");

// Criando model tabela categories
const Categoty = connection.define("categories", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
        // slug = nome separado por "-" e sem acentos
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Expportando model
module.exports = Categoty;