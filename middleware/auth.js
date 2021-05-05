const authUser = function authUser(req, res, next) {
    if(req.cookies.name === 'AuthCookie'){
        next();
    }else{
        res.status(403).render("users/error", {title: "Error: Not allowed"});
    }
}
module.exports = authUser;