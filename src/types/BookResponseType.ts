import { BookType } from "./BookType.js"

type BookResponseType = {
    data:BookType|null,
    error:string|null,
    status:number
}
export {BookResponseType}
