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

// Criando rota padrão consultando artigos e ordenando por ID
app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ["id", "DESC"]
        ]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", { articles: articles, categories: categories });
        });
    });
});

// Rota para acessar artigos consultando pelo slug
app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", { article: article, categories: categories });
            });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

// Definindo porta que a aplicação escutará
app.listen(3000, () => {
    console.log("O servidor está rodando!");
});