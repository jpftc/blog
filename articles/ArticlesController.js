// Importando express
const express = require("express");
// Ferramenta do express para crirar rotas em outro arquivo
const router = express.Router();
// Importando model de consulta de catregorias para exibir na tela de artigos
const Category = require("../categories/Category");
// Importando model da tabela de artigos
const Article = require("./Article");
// Importando slugfy
const slugify = require("slugify");
const Categoty = require("../categories/Category");
// Importando middleware
const adminAuth = require("../middlewares/adminAuth");

// Criando rotas com Router e listando artigos e fazendo join com include
router.get("/admin/articles", adminAuth, (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
        res.render("admin/articles/index", { articles: articles });
    });
});

// Criando rota para novo artigo
router.get("/admin/articles/new", adminAuth, (req, res) => {
    Category.findAll({}).then(categories => {
        res.render("admin/articles/new", { categories: categories });
    });
});

// Rota para salvar artigo no banco de dados
router.post("/articles/save", adminAuth, (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    });

})

// Rota para deletar um artigo
router.post("/articles/delete", adminAuth, (req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {

            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });

        } else {
            res.redirect("/admin/articles");
        }
    } else {
        res.redirect("/admin/articles");
    }
});

// Rota para editar artigos, realiza consulta pela ID do artigo com findByPk e com findAll nas categorias
router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id;
    Article.findByPk(id).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {categories: categories, article: article});
            });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

// Atualizando dados no banco de dados
router.post("/articles/update", adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({title: title, body: body, categoryId: category, slug: slugify(title)}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/")
    });
});

// Rota com logica de paginação
router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0;

    if (isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (parseInt(page) -1) * 4;
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ["id","DESC"]
        ]
    }).then(articles => {

        var next;
        if (offset + 4 >= articles.count) {
            next = false;
        } else {
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories})
        });
    });
});

// Exportando rotas
module.exports = router;