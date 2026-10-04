import express, {Request} from "express"
import "dotenv/config"
import router from "./routes/bookRoutes.js"
import authorRouter from "./routes/authorRoutes.js"
import authRouter from "./routes/authRoutes.js"
import path from "node:path"
import ejs from "ejs"
import { fileURLToPath } from "node:url";
import expressEjsLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middlewares/auth_middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
const cl = console.log
const PORT = process.env.PORT || 4200
const HOST = process.env.HOST || "http://localhost"
 
const app = express()

app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");
app.use(expressEjsLayouts);
app.set("layout", path.join(__dirname, "..", "views", "layouts", "main"));


app.use(express.static("public"))
app.use(express.json()) //body -> json
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(authMiddleware)
app.get('/', (req:Request<null,null,null,{title:string}>,res)=>{
    
    res.render("pages/home",{
        title:"Home",
        name:req.query.title
    })
})
app.use("/books", router);
app.use("/book", router);
app.use("/authors", authorRouter);
app.use("/", authRouter);
app.get('/contacts', (req,res)=>{
    res.render("pages/contacts",{
        title:"Contacts"
    })
})

 
app.listen(PORT, ()=>{
    cl(`Server has been started ${HOST}:${PORT}`)
})
