const jwt = require("jsonwebtoken");
async function isAuthenticated(req, res, next) {
    try {
        console.log(req.headers?.["authorization"]?.split(" ")[1])

        const token = req.headers?.["authorization"]?.split(" ")[1];
        jwt.verify(token, "secretKey", (err, payload) => {
            if(err) return res.json({error: err})
            req.user = payload;
            next();
        })
    } catch (error) {
        return res.json({error: error.message})
    }
}
module.exports = {
    isAuthenticated
}