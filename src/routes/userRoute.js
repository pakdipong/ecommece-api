const express = require('express')
const router = express.Router()
const user = require('../controllers/userController')
const { authenticateToken } = require('../middlewares/middleware')

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: User profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Profile
 *       404:
 *         description: Profile Not Found
 *       500:
 *         description: Internal server error
 */
router.get('/profile', authenticateToken, user.getProfile)

/**
 * @swagger
 * /api/users/password:
 *   put:
 *     summary: Change password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                -password
 *              properties:
 *                password:
 *                  type: string
 *                  desciption: New password
 *     responses:
 *       200:
 *         description: Password changed successfully!
 *       400:
 *         description: Failed to Change Password
 */
router.put('/password', authenticateToken, user.updatePassword)

/**
 * @swagger
 * /api/users/notification:
 *   put:
 *     summary: Setting notification
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                -notification
 *              properties:
 *                notification:
 *                  type: string
 *                  desciption: Setting notification ('on' or 'off')
 *              example:
 *                notification: on
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal server error
 */
router.put('/notification', authenticateToken, user.notificationSettings)

module.exports = router