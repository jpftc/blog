// Importando biblioteca do express
const express = require("express");
const app = express();
// Importando bodyParser (para capturar dados do frontend)
const bodyParser = require("body-parser");
// Importando conexão com o banco de dados
const connection = require("./database/database");

// Importando rotas dos Controllers
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");

// Importando models para criar as tabelas
const Article = require("./articles/Article");
const Category = require("./categories/Category");

// Carregando view engine (Precisa do diretório views)
app.set("view engine", "ejs");

// Configurando diretório de arquivos estáticos
app.use(express.static("public"));

// Configurando body-parser 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conectando com banco de dados
connection
    .authenticate()
    .then(() => {
        console.log("Conexão realizada com sucesso!");
    }).catch((error) => {
        console.log(error);
    });

// Usando rotas do arquivo categoriesCOntrolller
app.use("/", categoriesController);
app.use("/", articlesController);

// Criando rota padrão
app.get("/", (req, res) => {
    res.render("index")
});

// Definindo porta que a aplicação escutará
app.listen(3000, () => {
    console.log("O servidor está rodando!");
});