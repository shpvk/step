import { Router, Request, Response } from "express";
import { books } from "../data/books.js";
import { BookCreateType, BookType } from "../types/BookType.js";
import { getBooksByTitle } from "../utils/showBooks.js";
import { BookResponseType } from "../types/BookResponseType.js";

const router = Router();

function compareBook(b1: BookType, b2: BookType): number {
  return b2.id - b1.id;
}

router.get("/", (req: Request, res: Response) => {
  const exist_book: boolean = books.length > 0;
  let our_books: BookType[] | null = null;
  if (req.query.title !== undefined) {
    const title = String(req.query.title);
    our_books = getBooksByTitle(title, books);
  }
  const response: BookResponseType = {
    data: exist_book ? (our_books !== null ? our_books : books) : null,
    error: exist_book ? null : "Books list is empty",
    status: exist_book ? 200 : 404,
  };
  res.status(response.status).json(response);
});

router.get("/:id", (req: Request, res: Response) => {
  const id: number = +req.params.id;
  const book: BookType | undefined = books.find((book) => book.id === id);
  const exist_book: boolean = book !== undefined;
  const response: BookResponseType = {
    data: exist_book ? (book as BookType) : null,
    error: exist_book ? null : "The book not found",
    status: exist_book ? 200 : 404,
  };
  res.status(response.status).json(response);
});

router.post("/", (req: Request<{}, BookResponseType, BookCreateType>, res: Response) => {
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

router.put("/:id", (req: Request<{ id: string }, BookResponseType, BookCreateType>, res: Response) => {
  const id: number = +req.params.id;
  const body = req.body;
  const index: number = books.findIndex((book) => book.id === id);
  const exist_book: boolean = index !== -1;
  const response: BookResponseType = {
    data: null,
    error: null,
    status: 500,
  };
  if (!exist_book) {
    response.error = "The book not found";
    response.status = 404;
  } else if (body === undefined) {
    response.error = "Body is empty";
    response.status = 400;
  } else {
    const book: BookType = {
      id,
      title: body.title,
      price: body.price,
      is_active: body.is_active,
    };
    books[index] = book;
    response.data = book;
    response.status = 200;
  }
  res.status(response.status).json(response);
});

router.delete("/:id", (req: Request, res: Response) => {
  const id: number = +req.params.id;
  const index: number = books.findIndex((book) => book.id === id);
  const exist_book: boolean = index !== -1;
  const response: BookResponseType = {
    data: exist_book ? books.splice(index, 1)[0] : null,
    error: exist_book ? null : "The book not found",
    status: exist_book ? 200 : 404,
  };
  res.status(response.status).json(response);
});

export default router;
