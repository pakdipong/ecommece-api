const jwt = require('jsonwebtoken')

const secret = process.env.SECRET_KEY

exports.authenticateToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) return res.sendStatus(401)
    try {
        const user = jwt.verify(token, secret)
        req.user = user
        next()
    } catch (error) {
        return res.sendStatus(403)
    }
}

exports.isLogin = (req, res, next) => {
    const token = req.cookies.checkpoint
    if (!token) return res.sendStatus(401)
    try {
        const user = jwt.verify(token, secret)
        req.user = user
        next()
    } catch (error) {
        return res.sendStatus(403)
    }
}

exports.isAdmin = (req, res, next) => {
    const role = req.user.role
    if (role != 'admin') {
        return res.sendStatus(403)
    }
    next()
}
