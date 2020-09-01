// Importando biblioteca Sequelize
const Sequelize = require("sequelize");

// Configurando conexão com o banco de dados
const connection = new Sequelize("guiapressjt", "jpftc", "lhp130894", {
    host: "mysql669.umbler.com",
    dialect: "mysql",
    timezone: "-03:00"
})

// Exportando modulo de conexão com o banco de dados (para usar em outros arquivos)
module.exports = connection;