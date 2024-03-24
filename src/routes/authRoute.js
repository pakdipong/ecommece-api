const express = require('express')
const router = express.Router()
const passport = require('passport')
const auth = require('../controllers/authController')
const { isLogin } = require('../middlewares/middleware')

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         -id
 *         -username
 *         -password
 *         -email
 *         -role
 *       properties:
 *         id:
 *            type: integer
 *            desciption: The auto-generated id of the user
 *         username:
 *            type: string
 *            desciption: Username
 *         password:
 *            type: string
 *            desciption: Password
 *         email:
 *            type: string
 *            desciption: The user email
 *         role:
 *            type: string
 *            desciption: The user role ( admin or user)
 *       example:
 *         username: momay
 *         password: momay
 *         email: momay@momay.com
 *         role: user
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Insert fail
 */
router.post('/register', auth.userRegister)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                -username
 *                -password
 *              properties:
 *                username:
 *                  type: string
 *                  desciption: Username
 *                password:
 *                  type: string
 *                  desciption: Password
 *     responses:
 *       200:
 *         description: Login successfully
 *       401:
 *         description: Login failed
 */
router.post('/login', auth.userLogin)

router.get('/google', passport.authenticate('google'))

router.get('/google/callback', passport.authenticate('google'), auth.googleLogin)

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP to user email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                -email
 *              properties:
 *                email:
 *                  type: string
 *                  desciption: The user email
 *              example:
 *                email: momay@momay.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Wrong Email
 *       500:
 *          description: Failed to send OTP
 */
router.post('/send-otp', isLogin, auth.sendOTP)

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP 
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                -email
 *                -otp
 *              properties:
 *                email:
 *                  type: string
 *                  desciption: The user email
 *                otp:
 *                  type: string
 *                  desciption: OTP for verify
 *              example:
 *                email: momay@momay.com
 *                otp: i23456
 *     responses:
 *       200:
 *         description: OTP verification successful
 *       400:
 *         description: Invalid OTP
 *       500:
 *         description: Failed
 */
router.post('/verify-otp', isLogin, auth.verifyOTP)

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User Logged out
 */
router.get('/logout', auth.userLogout)

module.exports = router