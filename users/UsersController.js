// Importando express
const express = require("express");
// Impoprtando router, para usar rotas no arquivo principal
const router = express.Router();
// Importando model user
const User = require("./User");
// Importando bcryptjs, para gerar senhas com hash, pra salvar no banco de daods
const bcrypt = require("bcryptjs");
const { route } = require("../articles/ArticlesController");

// Criando rota de listagem de usuários
router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", { users: users });
    });
});

// Criando rota de criação de usuários
router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email: email } }).then(user => {
        if (user == undefined) {
            // Um "tempero" para gerar o hash da senha, numero aleatório passado como parametro
            var salt = bcrypt.genSaltSync(10);
            // Gerando o hash da senha, passando a senha e o "tempero" como parametro
            var hash = bcrypt.hashSync(password, salt);

            // Inserindo no banco de dados, email e hash
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/");
            }).catch((err) => {
                res.redirect("/");
            });
        } else {
            res.redirect("/admin/users/create");
        }
    });
});

// Criando rota da pagina de login
router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

// Criando rota de autenticação
router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email: email } }).then(user => {
        if (user != undefined) {
            // valida senha
            var correct = bcrypt.compareSync(password, user.password);
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login");
        }
    });
});

// Rota de logout, limpando session user
router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
})

// Exportando modulo router, para usar rotas no arquivo principal
module.exports = router;