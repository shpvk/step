import http from "node:http"
import fs from "node:fs"
import path from "node:path";
import { URL } from "node:url";
import 'dotenv/config'
import { books } from "./data/books.js"
import { BookType } from "./types/BookType.js"
import { showAllBooks, showBook } from "./utils/showBooks.js"

console.log(process.env.SERVER_NAME)

const server = http.createServer((req,res)=>{
    const PATH_TO_PAGES = path.join("src","pages")
    const url = new URL(req.url??"/", `http://${req.headers.host}`)
    console.log(req.url, path.extname(req.url as string))
    if(req.method==="GET" && path.extname(req.url as string)==='.css')
    {
        const PATH_TO_CSS = path.join("src","styles",req.url as string)
        const content = fs.readFileSync(PATH_TO_CSS)
        res.setHeader("Content-Type", "text/css; charset=utf-8")

        res.write(content)
    }

    if(req.method==="GET" &&  req.url==='/books')
    {
        const books_content:string = showAllBooks(books)
        const layout = fs.readFileSync(path.join(PATH_TO_PAGES,"index.html"),"utf-8")
        res.setHeader("Content-Type", "text/html; charset=utf-8")
        res.write(layout.replace("{{books}}", books_content))
        res.end()
        return
    }

    if(req.method==="GET" &&  req.url==='/books/1')
    {
        const first_book = books.find(book=>book.id===1)
        const books_content: string = first_book ? showBook(first_book) : "<p>Книга не знайдена</p>"
        const layout = fs.readFileSync(path.join(PATH_TO_PAGES,"index.html"),"utf-8")
        res.setHeader("Content-Type", "text/html; charset=utf-8")
        res.write(layout.replace("{{books}}", books_content))
        res.end()
        return
    }

    if(req.method==="GET" && (req.url==='/' || req.url==="/index.html"))
    {
        const PATH_TO_INDEX_PAGE = path.join(PATH_TO_PAGES,"index.html")
        const content = fs.readFileSync(PATH_TO_INDEX_PAGE,"utf-8")
        res.setHeader("Content-Type", "text/html; charset=utf-8")

        res.write(content.replace("{{books}}", ""))
    }
    else if(req.method==="GET" && req.url==='/about.html')
    {
        const PATH_TO_ABOUT_PAGE = path.join(PATH_TO_PAGES,"about.html")
        const content = fs.readFileSync(PATH_TO_ABOUT_PAGE)
        res.setHeader("Content-Type", "text/html; charset=utf-8")

        res.write(content)
    }
    else if(req.method === "GET" && url.pathname==='/book/' && url.searchParams)
    {
        if(url.searchParams.get("id")!==null)
        {
            const id:number = Number(url.searchParams.get("id"))
            const book : BookType|undefined = books.find(book=>book.id===id)
            const books_content:string = book ? showBook(book) : "<p>Книга не знайдена</p>"
            const layout = fs.readFileSync(path.join(PATH_TO_PAGES,"index.html"),"utf-8")
            res.setHeader("Content-Type", "text/html; charset=utf-8")
            res.write(layout.replace("{{books}}", books_content))
        }

        res.end()
        return
    }
    else if(req.method === "GET")
    {
        console.log(url)
        res.end()
        return
    }
    else if(req.method === "POST"){
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        const user = {
            name: "Alex",
            age: 20
        }
        res.write(JSON.stringify(user));
        //res.write(`Ти хочеш cтворити дані. Request: ${req.method}`)
    }
    else if(req.method === "PUT"){
        res.write(`Ти хочеш оновити дані. Request: ${req.method}`)
    }

    res.end()
})
server.listen(process.env.PORT,()=>{
    console.log(`Server ${process.env.HOST}:${process.env.PORT} has been started...`)
})
