import express from "express"
import path from "node:path"
import "dotenv/config"
import { BookType } from "./types/BookType.js"
import { BookResponseType } from "./types/BookResponseType.js"

const cl = console.log
const PORT = process.env.PORT || 3200
const HOST = process.env.HOST || "http://localhost"

const app = express()

const book:BookType = {
    id:1,
    title:"new book",
    price:2000,
    is_active:true
}

const books:BookType[] = [
    {
        id:1,
        title:"new book",
        price:2000,
        is_active:true
    },
    {
        id:2,
        title:"second book",
        price:1500,
        is_active:false
    }
]

app.get('/book/:title/:is_active', (req, res) => {
    const title:string = req.params.title.toLowerCase()
    const is_active:boolean = (req.params.is_active === "true")
    const book:BookType|undefined = books.find((book)=>book.title.toLowerCase().includes(title) && book.is_active===is_active);
    const exist_book:boolean = (book!==undefined)
    const response:BookResponseType = {
        data:exist_book?book as BookType:null,
        error:exist_book?null:"The book not found",
        status:exist_book?200:404
    };

    res.writeHead(response.status,{
        "Content-Type":"application/json"
    })
    res.end(JSON.stringify(response))
})

app.get('/',(req,res)=>{
    res.writeHead(200,{
        "Content-Type":"text/html"
    })
    res.end("<h2>Hello from express</h2>")
})

app.get('/book',(req,res)=>{
    res.writeHead(200,{
        "Content-Type":"application/json"
    })
    res.end(JSON.stringify(book))
})

app.get('/books',(req,res)=>{
    res.writeHead(200,{
        "Content-Type":"application/json"
    })
    res.end(JSON.stringify(books))
})

app.get('/books/:id',(req,res)=>{
    const id:number = +req.params.id
    const book:BookType|undefined = books.find((book)=>book.id===id);
    const exist_book:boolean = (book!==undefined)
    const response:BookResponseType = {
        data:exist_book?book as BookType:null,
        error:exist_book?null:"The book not found",
        status:exist_book?200:404
    };

    res.writeHead(response.status,{
        "Content-Type":"application/json"
    })
    res.end(JSON.stringify(response))
})

app.post('/book', (req, res)=>{
    let book:BookType = {
        id:3,
        title:"testdelete",
        price:0,
        is_active:true
    }

    books.push(book);

    res.writeHead(201,{
        "Content-Type":"application/json"
    })
    res.end(JSON.stringify(book))
})

app.delete('/books/:id',(req,res)=>{
    const id:number = +req.params.id
    const book:BookType | undefined = books.find((book)=>book.id===id);
    const index:number = books.indexOf(book as BookType)
    const exist_book:boolean = (book!==undefined)
    const response:BookResponseType = {
        data:exist_book?books[index]:null,
        error:exist_book?null:"The book not found",
        status:exist_book?200:404
    };
    if(exist_book)
    {
        delete(books[index]);
        for(let i=index;i<books.length-1;i++)
        {
            books[i] = books[i+1]
        }
        books.length--
    }

    res.writeHead(response.status,{
        "Content-Type":"application/json"
    })
    res.end(JSON.stringify(response))
})

app.use('/images', express.static(path.join("images")))
app.use(express.static(path.join("src","styles")))
app.use(express.static(path.join("src","pages")))

app.listen(PORT, ()=>{
    cl(`Server has been started ${HOST}:${PORT}`)
})