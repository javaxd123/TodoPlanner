const jwt = require('jsonwebtoken')
const key = require('../helper/secretkey')
const User = require('../model/user')

const authenticate = (req, res, next) => {
    const token = req.header('x-auth') || req.body.token
    jwt.verify(token, key.SECRET_KEY.toString(), (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(403).send({
                success: false
            })
        } else {
            req.decoded = decoded
            next()
        }
    })

}

const authenticateAdmin = (req, res, next) => {
    const token = req.header('x-auth') || req.body.token
    let decoded
    try {
        decoded = jwt.verify(token, key.SECRET_KEY.toString())
    } catch (error) {
        return res.status(401).send({
            error
        })
    }

    if (!decoded.admin) {
        return res.status(401).send({
            decoded
        })
    }
    next()
}

module.exports = {
    authenticate, authenticateAdmin
}