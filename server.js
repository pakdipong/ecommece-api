const express = require('express')
const cors = require("cors")
const cookieParser = require("cookie-parser")
const session = require('express-session')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const authRoute = require('./src/routes/authRoute')
const userRoute = require('./src/routes/userRoute')
const productRoute = require('./src/routes/productRoute')

require('./src/strategies/googleStrategy')
const app = express()
const port = 3000

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecommerce API',
            version: '1.0.0',
            description: 'A simple Express Ecommerce API'
        },
        servers: [
            {
                url: 'http://localhost:3000/'
            }
        ]  
    },
    apis: ['./src/routes/*.js']
}

const specs = swaggerJsDoc(options)

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))

app.get('/', (req, res) => {
    res.send(
        req.cookies.token ? 'Logged in' : 'Logged out'
    )
})

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/products', productRoute)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})