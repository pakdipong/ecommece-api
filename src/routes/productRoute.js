const express = require('express')
const router = express.Router()
const product = require('../controllers/productController')
const { authenticateToken, isAdmin } = require('../middlewares/middleware')

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         -id
 *         -productname
 *         -description
 *         -price
 *         -quantity
 *       properties:
 *         id:
 *            type: integer
 *            desciption: The auto-generated id of the product
 *         productname:
 *            type: string
 *            desciption: Product Name
 *         description:
 *            type: string
 *            desciption: Product Description
 *         price:
 *            type: number
 *            format: float
 *            desciption: Product Price
 *         quantity:
 *            type: integer
 *            desciption: Product Quantity
 *       example:
 *         productname: Coca Cola
 *         description: Coca-Cola is a carbonated soft drink with a cola flavor manufactured.
 *         price: 20.00
 *         quantity: 120
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: All products
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, product.getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateToken, product.getProductById)

/**
 * @swagger
 * /api/products/new:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Failed to create a product
 */
router.post('/new', authenticateToken, isAdmin, product.newProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: product updated successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Failed to update a product
 */
router.put('/:id', authenticateToken, isAdmin, product.updateProductById)

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Remove the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, isAdmin, product.deleteProductById)

module.exports = router