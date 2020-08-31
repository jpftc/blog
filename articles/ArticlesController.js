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

// Criando rotas com Router e listando artigos e fazendo join com include
router.get("/admin/articles", (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index", {articles: articles});
    });
});

// Criando rota para novo artigo
router.get("/admin/articles/new", (req, res) => {
    Category.findAll({}).then(categories => {
        res.render("admin/articles/new", {categories: categories});
    });
});

// Rota para salvar artigo no banco de dados
router.post("/articles/save", (req, res) => {
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
router.post("/articles/delete", (req, res) => {
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

// Exportando rotas
module.exports = router;