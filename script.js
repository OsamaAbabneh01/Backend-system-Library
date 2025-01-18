const express = require("express");
const server = express();
server.use(express.json());

class Book
{
    constructor(id, name, title)
    {
        this.Id = id;
        this.Name = name;
        this.Title = title;
    }

    static Validation(book)
    {
        if (!book instanceof Book)
            return "Input is not instanceof Book";
        
        if (!book.Id || typeof book.Id !== "number")
            return "Invalid ID";
        
        if (!book.Name || typeof book.Name !== "string")
            return "Invalid Name Book";
        
        if (!book.Title || typeof book.Title !== "string")
            return "Invalid Title Book";
        
        return null;
    }

    ChangeTreanslation(languge)
    {
        this.Title = `${this.Title} - (${languge})`;
    }
}

let ListOfBooks = [];

server.post("/books", (req, res) => {
    const {id, name, title} = req.body;
    newBook = new Book(id, name, title);
    
    if (validation = Book.Validation(newBook))
        return res.status(400).json({"Error-Message":`${validation}`});
    if (ListOfBooks.some(b => b.Id === newBook.Id))
        return res.status(400).json({"Error-Message":"can't add book, already exsits"});

    ListOfBooks.push(newBook);
        return res.status(201).json({"Message":"Book added Successfully"});
});

server.get("/books", (req, res) => {
    return res.json(ListOfBooks);
});

server.get("/books/:id", (req, res) => {
    let index = ListOfBooks.findIndex(book => book.Id === parseInt(req.params.id));
    if (index === -1)
        return res.status(404).json({"Error":"Book is not exists"});
    return res.json(ListOfBooks[index]);
});

server.put("/books/:id", (req, res) => {
    const {name, title} = req.body;
    const id = parseInt(req.params.id);
    let index = ListOfBooks.findIndex(book => book.Id === id);
    if (index === -1)
        return res.status(404).json({"Error":"Book is not exists"});


    ListOfBooks[index].Name = name;
    ListOfBooks[index].Title = title;
    return res.json({"Message":"Book information is updated"});
});

server.delete("/books/:id", (req, res) => {
    const ID = parseInt(req.params.id);
    index = ListOfBooks.findIndex((book) => book.Id == ID);
    if (index === -1)
        return res.status(404).json({"Error":"Book in not exists"});

    ListOfBooks.splice(index, 1);
    return res.json({"Message":"Book is deleted"});
});

server.patch("/books/:id/translate", (req, res) => {
    const {language} = req.body;
    let book = ListOfBooks.find(book => book.Id === parseInt(req.params.id));
    
    if (!language || typeof language !== "string")
        return res.status(404).json({Message:"Invalid or missing language"});

    if (!book)
        return res.status(404).json({Message:"Book is not exists"});

    book.ChangeTreanslation(language);
    return res.json({book});
});

server.listen(3000, () => {
    console.log("Server is running on localhost at port 3000");
});