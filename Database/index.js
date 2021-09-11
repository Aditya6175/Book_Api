const books = [{
    ISBN: "12345ONE",
    title: "Getting started with MERN",
    authors:[1, 2, 3],
    language:"en",
    pubDate:"2021-07-07",
    numofPage: 225,
    category:["fiction", "programming", "tech", "web Dev"],
    publication: 1,
},
{
    ISBN: "12345two",
    title: "Getting started with Java",
    authors:[1, 2, 3],
    language:"en",
    pubDate:"2021-07-07",
    numofPage: 225,
    category:["fiction", "tech", "web Dev"],
    publication: 1,
}
];


const authors = [{
    id:1,
    name: "Aditya",
    books:["12345ONE"],
    },
    {
        id:2,
        name: "pavan",
        books:["12345two"],
    }
];

const publications = [{
    id:1,
    name:"chakra",
    books:["12345ONE"],
}];

module.exports = {books, authors, publications};