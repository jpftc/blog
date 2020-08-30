// Importando express
const express = require("express");
// Ferramenta do express para crirar rotas em outro arquivo
const router = express.Router();
// Carregando model de categoria
const Category = require("./Category");
// Carregando Slugify (transforma strings em "slugs")
const slugify = require("slugify");

// Criando rotas com Router
router.get("/admin/categories/new", (req, res) => {
    res.render("admin/categories/new");
})

// Criando rota que vai salvar o titulo da categoria no banco de dados
router.post("/categories/save", (req, res) => {
    var title = req.body.title;
    if (title != undefined) {

        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/");
        });

    } else {
        res.redirect("/admin/categories/new");
    }
});

router.get("/admin/categories", (req, res) => {
    res.render("admin/categories/index");
});

// Exportando rotas
module.exports = router;