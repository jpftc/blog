// Importando express
const express = require("express");
// Ferramenta do express para crirar rotas em outro arquivo
const router = express.Router();

// Criando rotas com Router
router.get("/articles", (req, res) => {
    res.send("ROTA artigo");
});
router.get("/admin/articles/new", (req, res) => {
    res.send("ROTA PARA CRIAR UMA NOVA ROTA artigo!");
});

// Exportando rotas
module.exports = router;