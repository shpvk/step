import { Router, Request, Response } from "express";
import multer from "multer";
import path from "node:path";
import * as fs from "node:fs/promises";
import { books } from "../data/books.js";
import { BookCreateType, BookType } from "../types/BookType.js";
import { AuthorType } from "../types/AuthorType.js";
import { compareBook, getBooksByTitle } from "../utils/showBooks.js";
import { BookResponseType } from "../types/BookResponseType.js";
import { pool } from "../db/db_connection.js"
import { loggerMiddleware } from "../middlewares/logger_middleware.js"
import "dotenv/config"
const bookRouter = Router();
bookRouter.use(loggerMiddleware);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("public", "images"));
  },
  filename: (req, file, cb) => {
    const uniqueFileName = Date.now() + "_" + file.originalname;
    req.image = uniqueFileName;
    cb(null, uniqueFileName);
  },
});
const upload = multer({ storage });

bookRouter.get(
  "/add-book",
  (req: Request, res: Response) => {
    res.render("pages/bookForm", { title: "Add Book" });
  },
);

bookRouter.post(
  "/add-book",
  upload.single("image"),
  (req: Request<{}, BookCreateType>, res: Response) => {
    const { title, price, year } = req.body;
    res.end();
  },
);

//отримання всіх книжок та книжок за полем title
bookRouter.get("/", async (req: Request<{}, {}, {}, { title?: string }>, res: Response) => {
  const title = req.query.title;

  if (title !== undefined) {
    const response = await fetch(`${process.env.PATH_TO_JSON_SERVER}/books?title:contains=${title}`);
    const found: BookType[] = await response.json();
    res.render("pages/books", { books: found, title: "Books" });
    return;
  }

  const response = await fetch(`${process.env.PATH_TO_JSON_SERVER}/books`);
  const data: BookType[] = await response.json();
  res.render("pages/books", { books: data, title: "Books" });
});

//отримання книжки за id
bookRouter.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = +req.params.id;
  const data = await pool.query<BookType>("SELECT * FROM books WHERE id=$1", [id]);
  const book = data.rows[0];

  if (book === undefined) {
    res.status(404).render("pages/error", {
      title: "Error",
      message: "The book not found",
    });
    return;
  }

  const authorsData = await pool.query<AuthorType>(
    `SELECT a.* FROM authors a
     JOIN book_authors ba ON ba.author_id = a.id
     WHERE ba.book_id = $1
     ORDER BY a.id`,
    [id],
  );

  res.render("pages/book", { book, authors: authorsData.rows, title: book.title });
});

//створення книжки
bookRouter.post("/", (req: Request<{}, BookResponseType, BookCreateType>, res) => {
  const body = req.body;
  const response: BookResponseType = {
    data: null,
    error: null,
    status: 500,
  };
  if (body !== undefined) {
    const id: number = books.length > 0 ? books.sort(compareBook)[0].id + 1 : 1;
    const book: BookType = {
      id,
      title: body.title,
      price: body.price,
      is_active: body.is_active,
    };
    books.push(book);
    response.data = book;
    response.status = 201;
  }
 
  res.status(response.status).json(response);
});
 
// удаление книжки по id (DELETE)
bookRouter.delete(
  "/:id",
  async (req: Request<{ id: string }, BookResponseType>, res: Response) => {
    const id = +req.params.id;
    const response = await fetch(`${process.env.PATH_TO_JSON_SERVER}/books/${id}`);

    if (response.status === 404) {
      res.status(404).json({
        data: null,
        error: "The book not found",
        status: 404,
      });
      return;
    }

    const book: BookType = await response.json();
    await fetch(`${process.env.PATH_TO_JSON_SERVER}/books/${id}`, { method: "DELETE" });

    if (book.image !== undefined) {
      await fs.rm(path.join("public", "images", book.image), { force: true });
    }

    res.status(200).json({
      data: book,
      error: null,
      status: 200,
    });
  },
);

// полное обновление книжки (PUT)
bookRouter.put(
  "/:id",
  async (
    req: Request<{ id: string }, BookResponseType, BookCreateType>,
    res: Response,
  ) => {
    const id = +req.params.id;
    const { title, price, is_active } = req.body;
    const response = await fetch(`${process.env.PATH_TO_JSON_SERVER}/books/${id}`);

    if (response.status === 404) {
      res.status(404).json({
        data: null,
        error: "The book not found",
        status: 404,
      });
      return;
    }

    const current: BookType = await response.json();
    const updated = await fetch(`${process.env.PATH_TO_JSON_SERVER}/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, price, is_active, image: current.image }),
    });
    const book: BookType = await updated.json();

    res.status(200).json({
      data: book,
      error: null,
      status: 200,
    });
  },
);

export default bookRouter
