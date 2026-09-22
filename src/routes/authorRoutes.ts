import { Router, Request, Response } from "express";
import { AuthorType } from "../types/AuthorType.js";
import { BookType } from "../types/BookType.js";
import { pool } from "../db/db_connection.js"
import { loggerMiddleware } from "../middlewares/logger_middleware.js"
const authorRouter = Router();
authorRouter.use(loggerMiddleware);

//отримання всіх авторів
authorRouter.get("/", async (req: Request, res: Response) => {
  const data = await pool.query<AuthorType>("SELECT * FROM authors ORDER BY id");
  res.render("pages/authors", { authors: data.rows, title: "Authors" });
});

//отримання автора за id разом з його книжками
authorRouter.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = +req.params.id;
  const data = await pool.query<AuthorType>("SELECT * FROM authors WHERE id=$1", [id]);
  const author = data.rows[0];

  if (author === undefined) {
    res.status(404).render("pages/error", {
      title: "Error",
      message: "The author not found",
    });
    return;
  }

  const booksData = await pool.query<BookType>(
    `SELECT b.* FROM books b
     JOIN book_authors ba ON ba.book_id = b.id
     WHERE ba.author_id = $1
     ORDER BY b.id`,
    [id],
  );

  res.render("pages/author", {
    author,
    books: booksData.rows,
    title: author.name,
  });
});

export default authorRouter
