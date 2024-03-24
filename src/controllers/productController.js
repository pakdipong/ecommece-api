const conn = require('../db/db')
const nodemailer = require("nodemailer")

exports.newProduct = async (req, res) => {
    const product = req.body
    try {
        const [result] = await conn.query('INSERT INTO products SET ?', product)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.YOUR_EMAIL,
                pass: process.env.YOUR_PASS,
            }
        })
        const [user] = await conn.query('SELECT * FROM users WHERE notification = ?', 'on')
        for (let i = 0; i < user.length; i++) {
            const mailOptions = {
                from: 'ecomm@example.com',
                to: user[i].email,
                subject: 'New Product',
                text: `New Product : ${product.productname}`
            }
            const info = await transporter.sendMail(mailOptions)
            console.log('Email sent: ' + info.response)
          }
        res.status(201).json({
            message: 'Product created successfully'
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Failed to create a product",
            error: error.message
        })
    }
}

exports.getProducts = async (req, res) => {
    try {
        const [products] = await conn.query('SELECT * FROM products')
        res.status(200).json(products)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

exports.getProductById = async (req, res) => {
    const { id } = req.params
    try {
        const [product] = await conn.query('SELECT * FROM products WHERE id = ?', id)
        if (!product[0]) {
            return res.status(404).json({
                message: 'Product not found'
            })
        }
        res.status(200).json(product)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

exports.updateProductById = async (req, res) => {
    const { id } = req.params
    const updateProduct = req.body
    try {
        const [product] = await conn.query('SELECT * FROM products WHERE id = ?', id)
        if (!product[0]) {
            return res.status(404).json({
                message: 'Product not found'
            })
        }
        const [result] = await conn.query('UPDATE products SET ? WHERE id = ?', [updateProduct, id])
        res.status(200).json({
            message: 'product updated successfully'
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Failed to update a product",
            error: error.message
        })
    }
}

exports.deleteProductById = async (req, res) => {
    const { id } = req.params
    try {
        const [product] = await conn.query('SELECT * FROM products WHERE id = ?', id)
        if (!product[0]) {
            return res.status(404).json({
                message: 'Product not found'
            })
        }
        const [result] = await conn.query('DELETE FROM products WHERE id = ?', id)
        res.status(200).json({
            productId: id,
            message: 'Product deleted successfully'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}