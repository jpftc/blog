// Importando biblioteca do express
const express = require("express");
const app = express();
// Importando bodyParser (para capturar dados do frontend)
const bodyParser = require("body-parser");
// Importando express session, biblioteca para desenvolver sistema de autenticação
const session = require("express-session");
// Importando conexão com o banco de dados
const connection = require("./database/database");

// Importando rotas dos Controllers
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const UsersController = require("./users/UsersController");

// Importando models para criar as tabelas
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

// Carregando view engine (Precisa do diretório views)
app.set("view engine", "ejs");

// Ativando sessões
app.use(session({
    secret: "jdhsabdajhqualquercoisalkdjnsalkdaskkl", cookie: { maxAge: 30000000 },
    resave: true,
    saveUninitialized: true
}));

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
app.use("/", UsersController);

// Criando rotas das sessões

// Criando rota padrão consultando artigos e ordenando por ID, limita a busca para 4 resultados
app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ["id", "DESC"]
        ],
        limit: 4
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

// Rota para o menu da navbar, usando join na consulta, para exibir uma pagina com os artigos de uma determinada categoria
app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{ model: Article }]
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", { articles: category.articles, categories: categories });
            })
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