// Importando express
const express = require("express");
// Ferramenta do express para crirar rotas em outro arquivo
const router = express.Router();
// Carregando model de categoria
const Category = require("./Category");
// Carregando Slugify (transforma strings em "slugs")
const slugify = require("slugify");
const Categoty = require("./Category");

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
            res.redirect("/admin/categories");
        });

    } else {
        res.redirect("/admin/categories/new");
    }
});

// Consulta na tabela de categorias e envia para o frontend
router.get("/admin/categories", (req, res) => {
    Categoty.findAll().then(categories => {
        res.render("admin/categories/index", { categories: categories });
    });
});


// Rota para deletar uma categoria
router.post("/categories/delete", (req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            });

        } else {
            res.redirect("/admin/categories");
        }
    } else {
        res.redirect("/admin/categories");
    }
});

// Rota para editar a categoria (realiza consulta no banco de dados pelo ID)
router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id;
    if(isNaN(id)) {
        res.redirect("/admin/categories");
    }
    Category.findByPk(id).then(category => {
        if (category != undefined) {
            res.render("admin/categories/edit", {category: category});
        } else {
            res.redirect("/admin/categories");
        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    });
});

// Atualizando dados no banco de dados (obs: req.body pega dados via form)
router.post("/categories/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update({title: title, slug: slugify(title)}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories");
    });
});

// Exportando rotas
module.exports = router;