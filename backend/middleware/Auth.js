exports.checkAuthentication = function(req,res,next) {
    if(req.isAuthenticated()){
        next();
    } else{
        res.status(403).send("Unauthorized");
    }
}

exports.checkIsActive = function(req, res, next) {
    if (req.user.isActive) {
        next();
    } else {
        res.status(401).send({message: "Unverified user"});
    }
}