import { BookType } from "../types/BookType.js";

export function showBook(book: BookType): string {
    return `
        <article class="book">
            <h2>${book.title}</h2>
            <p>Автор: ${book.author}</p>
            <p>Рік видання: ${book.year}</p>
        </article>
    `;
}

export function showAllBooks(books: BookType[]): string {
    return books.map(showBook).join('');
}
