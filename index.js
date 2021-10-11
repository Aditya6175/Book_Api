require("dotenv").config();

//Frame Work
const express = require("express");
const mongoose = require("mongoose")

//Data Base
const Database = require("./Database/index");

//Models
const BookModel = require("./Database/book");
const AuthorModel = require("./Database/author");
const PublicationModel = require("./Database/publication");

//Initialization  Express
const ShapeAi = express();

//configuration express
ShapeAi.use(express.json());

//establish database connection
mongoose.connect(process.env.MONGO_URL, {

}).then(() => console.log("connection established!!!!!!!!!!!!!!"));



/*
Route                   /
Description             get all the books
Access                  public
Parameters              none
Method                  Get
*/
ShapeAi.get("/" ,async  (req, res) =>{
    const getAllBooks = await BookModel.find();
    console.log(getAllBooks);
    return res.json(getAllBooks)
});


/*
Route                   /is
Description             get specific books based on ISBN
Access                  public
Parameters              isbn
Method                  Get
*/
ShapeAi.get("/is/:isbn", async (req, res) => {

    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn})

    // const getSpecificBook = Database.books.filter((book) => book.ISBN === req.params.isbn);

    if(!getSpecificBook){
        return res.json({error: `No book found for the ISBN ${req.params.isbn}`});
    }

    return res.json({book: getSpecificBook});
});

/*
Route                   /category
Description             get specific books based on a category
Access                  public
Parameters              category
Method                  Get
*/
ShapeAi.get ("/c/:category",  async (req, res) => {

    const getSpecificBooks = await BookModel.findOne({category: req.params.category})

    // const getSpecificBooks = Database.books.filter((book) => book.category.includes(req.params.category));

    if(!getSpecificBooks){
        return res.json({error: `No book found for the category of ${req.params.category}`});
    }

    return res.json({book: getSpecificBooks});

})


/*
Route                   /author
Description             get all author
Access                  public
Parameters              none
Method                  Get
*/
ShapeAi.get("/author",  async(req, res) => {
    const getAllAuthors = await AuthorModel.find()
    return res.json({authors: getAllAuthors})

});


/*
Route                   /author
Description             get a list of authors based on the books ISBN
Access                  public
Parameters              isbn
Method                  Get
*/
ShapeAi.get("/author/:isbn", (req, res) =>{
    const getSpecificAuthors = Database.authors.filter((author) => author.books.includes(req.params.isbn));

    if(getSpecificAuthors.length ===0) {
        return res.json({
            error: `No author found for the book ${req.params.isbn}`});
    }

    return res.json({ authors: getSpecificAuthors});
});


/*
Route                   /publication
Description             get all publications
Access                  public
Parameters              NONE
Method                  Get
*/
ShapeAi.get("/publications", (req, res) =>{
    return res.json({publications: Database.publications});
})

/*
Route                   /book/new
Description             add new books
Access                  public
Parameters              NONE
Method                  POST
*/
ShapeAi.post("/book/new", async (req, res) =>{
    const {newBook} = req.body;

    const addNewBook = BookModel.create(newBook);

    

    return res.json({books : addNewBook, message: "book was added!"});
})

/*
Route                   /author/new
Description             add new author
Access                  public
Parameters              NONE
Method                  POST
*/
ShapeAi.post("/author/new",(req, res) => {
    const {newAuthor} = req.body;

    AuthorModel.create(newAuthor);

    return res.json({message: "authors was added!"});
})

/*
Route                   /Publication/new
Description             add new publication
Access                  public
Parameters              NONE
Method                  POST
*/
ShapeAi.post("/publication/new", (req, res) => {
    const {newPublication} = req.body;

    Database.publications.push(newPublication);

    return res.json({publications : Database.publications, message: "publications was added!"});
})

/*
Route                   /book/update
Description             update title of a book
Access                  public
Parameters              isbn
Method                  Put
*/
ShapeAi.put("/book/update/:isbn", async (req, res) =>{

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            title: req.body.bookTitle,
        },
        {
            new: true,
        }
    );

    // Database.books.forEach((book) => {
    //     if(book.ISBN === req.params.isbn) {
    //     book.title = req.body.bookTitle;
    //     return;
    //     }
    // });

    return res.json({books: updatedBook});
});

/*
Route                   /book/author/update
Description             update/add new author
Access                  public
Parameters              isbn
Method                  Put
*/
ShapeAi.put("/book/author/update/:isbn", async (req, res) => {
   //update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet: {
                authors: req.body.newAuthor,
            },
        },
        {
            new: true,
        }
    );

    
    // Database.book.forEach((book) => {
    //     if(book.ISBN === req.pramas.isbn) return book.author.push(req.body.newAuthor);
    // });

    // //update the author database

    const updateAuthor = await AuthorModel.findOneAndUpdate(
        {
           id: req.body.newAuthor, 
        },
        {
            $push:{
                books: req.params.isbn,
            },
        },
        {
            new: true,
        }
    );

    // Database.authors.forEach((author) => {
    //     if(author.id === req.body.newAuthor) return author.books.push( req.pramas.isbn)
    // });

    return res.json({books : updatedBook, authors: updateAuthor, message:" New author was added"})
});

/*
Route                   /publication/update/book
Description             Update/add new book to a publication
Access                  public
Parameters              isbn
Method                  Put
*/
ShapeAi.put("/publication/update/book/:isbn", (req, res) => {
    //update the publication database
    Database.publications.forEach((publication) => {
        if(publication.id === req.body.pubId) {
            return publication.books.push(req.params.isbn)
        };
    });

    //update the book database
    Database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });

    return res.json({books: Database.books, publications: Database.publications, message: "successfully updated publication",});
});

/*
Route                   /book/delete
Description             delete a book
Access                  public
Parameters              isbn
Method                  DELETE
*/
ShapeAi.delete("/book/delete/:isbn", async(req, res) => {

    const updatedBookDatabase = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
         }
 )
    
    // const updatedBookDatabase = Database.books.filter((book) => book.ISBN !== req.params.isbn );
    // Database.books = updatedBookDatabase;
    return res.json({books: Database.books });

});

/*
Route                   /book/delete/author
Description             delete a author from a book
Access                  public
Parameters              isbn, author id
Method                  DELETE
*/
ShapeAi.delete("/book/delete/author/:isbn/:authorId",  async (req, res) => {

    //update the book database

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $pull:{
                authors: parseInt(req.params.authorId),
            }
        },
        {
            new : true,
        }
    );
    // Database.books.forEach((book) =>{
    //     if(book.ISBN === req.params.isbn){
    //         const newAuthorList = book.authors.filter((author) => author !== parseInt(req.params.authorId));
    //         book.authors = newAuthorList;
    //         return;
    //     }
    // });

    //update the author database

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.authorId),
        },
        {
            $pull:{
                books: req.params.isbn,
            }
        },
        {
            new: true,
        }
    );

    // Database.authors.forEach((author) => {
    //     if(author.id === parseInt(req.params.authorId)){
    //         const newBooksList = author.books.filter((book) => book !== req.params.isbn);
    //         author.books = newBooksList;
    //         return;
    //     };
    // });
    return res.json({book: updatedBook, author: updateAuthor , message:"author was deleted!!!!!!" });

});


/*
Route                   /publication/delete/book
Description             Delete a book from publication
Access                  public
Parameters              isbn, publication id
Method                  Delete
*/

ShapeAi.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
    //update publication database
    Database.publications.forEach((publication) =>{
        if(publication.id === parseInt(req.params.pubId)){
            const newBooksList = publication.books.filter((book) => book !== req.params.isbn);
            publication.books = newBooksList;
        };
    });

    //update book database
    Database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publication = 0;
            return;
        };
    });
    return res.json({books: Database.books, publications: Database.publication})
});

ShapeAi.listen(3000, () => console.log("server is running!!"));