const bcrypt = require('bcrypt')
const conn = require('../db/db')

exports.updatePassword = async (req, res) => {
    try {
        const { email } = req.user
        const { password } = req.body
        if (!password) {
            return res.status(400).json({
                message: "Failed to Change Password"
            })
        }
        const salt = process.env.SALT_ROUND
        const hash = await bcrypt.hash(password, Number(salt))
        await conn.query('UPDATE users SET password =? WHERE email = ?', [hash, email])
        res.status(200).json({
            message: 'Password changed successfully!'
        })
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}

exports.getProfile = async (req, res) => {
    try {
        const { email } = req.user
        const [result] = await conn.query('SELECT * FROM users WHERE email = ?', [email])
        const profile = result[0]
        if (!profile) {
            return res.status(404).json({
                message: 'Profile Not Found'
            })
        }
        res.status(200).json(profile)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}

exports.notificationSettings = async (req, res) => {
    const { notification } = req.body
    const { email } = req.user
    try{
        await conn.query('UPDATE users SET notification = ? WHERE email = ?', [notification, email])
        res.status(200).json({
            email: email,
            notification: notification
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}