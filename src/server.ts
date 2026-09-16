import express from "express"
import "dotenv/config"
import bookRoutes from "./routes/bookRoutes.js"

const PORT = process.env.PORT || 3200
const HOST = process.env.HOST || "http://localhost"

const app = express()
app.use(express.json()) //body -> json

app.get('/', (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/html"
    })
    res.end()
})

app.use('/books', bookRoutes)

app.listen(PORT, () => {
    console.log(`Server has been started ${HOST}:${PORT}`)
})
