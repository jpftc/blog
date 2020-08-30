// Importando Sequelize
const Sequelize = require("sequelize");
// Importando conexão com o banco de dados
const connection = require("../database/database");
// Importando model de categoria
const Category = require("../categories/Category");
const Categoty = require("../categories/Category");

// Criando model tabela artigos
const Article = connection.define("articles", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
        // slug = nome separado por "-" e sem acentos
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// Relacionando 1-p-m
Categoty.hasMany(Article);
// Relacionando 1-p-1
Article.belongsTo(Categoty);

// Expportando model
module.exports = Article;