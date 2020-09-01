// Função middleware para autenticação de usuários admin
function adminAuth(req, res, next) {
    if (req.session.user != undefined) {
        next();
    } else {
        res.redirect("/login");
    }
}

// Exportando middleware
module.exports = adminAuth;