const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const speakeasy = require('speakeasy')
const nodemailer = require("nodemailer")
const conn = require('../db/db')

const secret = process.env.SECRET_KEY
const saltRound = process.env.SALT_ROUND

exports.userRegister = async (req, res) => {
    try {
        const { username, password, email, role } = req.body
        if (username == null) throw new Error('Username is required')
        if (password == null) throw new Error('Password is required')
        const salt =  await bcrypt.genSalt(Number(saltRound))
        const hash = await bcrypt.hash(password, salt)
        const user = {
            username,
            password: hash,
            email,
            role
        }
        await conn.query('INSERT INTO users SET ?', user)
        res.status(201).json({
            message: 'User registered successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "Insert fail",
            error: error.message
        })
    }
}

exports.userLogin = async (req, res) => {
    try {
        const { username, password } = req.body
        const [result] = await conn.query('SELECT * FROM users WHERE username = ?', username)
        const user = result[0]
        if (!user) {
            return res.status(401).json({
                message: 'Invalid username or password'
            })
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(401).json({
                message: 'Invalid username or password'
            })
        }
        const token = jwt.sign({ email: user.email }, secret, { expiresIn: "1h" })
        res.cookie('checkpoint', token, {
            secure: true,
            httpOnly: true,
            sameSite: 'none'
        })
        res.status(200).json({
            message: 'Login successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: 'Login failed'
        })
    }
}

exports.googleLogin = async (req, res) => {
    try {
        const { email, role, googleId } = req.user
        let [user] = await conn.query('SELECT * FROM users WHERE email = ?', email)
        if (!user[0]) {
            user = {
                email,
                role,
                googleId,
            }
            await conn.query('INSERT INTO users SET ?', user)
        }
        const token = jwt.sign({ email, role }, secret, { expiresIn: "1h" })
        res.cookie('token', token, {
            secure: true,
            httpOnly: true,
            maxAge: 3600000,
            sameSite: 'lax'
        })
        res.status(200).json({
            message: 'Login successfully'
        })
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: 'Google login failed'
        })
    }
}

exports.sendOTP = async (req, res) => {
    const { email } = req.body
    if (email !== req.user.email) {
        return res.status(400).json({
            message: 'Wrong Email'
        })
    }
    try {
        const secretBase32 = speakeasy.generateSecret().base32
        const result = await conn.query('UPDATE users SET secret = ? WHERE email = ?', [secretBase32, email])
        const otp = speakeasy.totp({
            secret: secretBase32,
            encoding: 'base32',
            step: 300
        })
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.YOUR_EMAIL,
                pass: process.env.YOUR_PASS,
            }
        })
        const mailOptions = {
            from: 'ecomm@example.com',
            to: email,
            subject: 'OTP Verification',
            text: `You OTP is: ${otp}`
        }
        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent: ' + info.response)
        res.status(200).json({
            message: 'OTP sent successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Failed to send OTP'
        })
    }
}

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body
    if (email !== req.user.email) {
        return res.status(400).json({
            message: 'Wrong Email'
        })
    }
    try {
        const [user] = await conn.query('SELECT * FROM users WHERE email = ?', email)
        const secretBase32 = user[0].secret
        const isValid = speakeasy.totp.verify({
            secret: secretBase32,
            encoding: 'base32',
            token: otp,
            step: 300
        })

        if (isValid) {
            const token = jwt.sign({ email: user[0].email, role: user[0].role }, secret, { expiresIn: "1h" })
            res.cookie('token', token, {
                secure: true,
                httpOnly: true,
                maxAge: 3600000,
                sameSite: 'Strict'
            })
            res.clearCookie('checkpoint')
            res.status(200).json({
                message: 'OTP verification successful'
            })
        } else {
            res.status(400).json({
                message: 'Invalid OTP'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Failed'
        })
    }

}

exports.userLogout = (req, res) => {
    res.clearCookie('token')
    res.status(200).json({
        message: 'Logged out'
    })
}