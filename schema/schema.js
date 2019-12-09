// Define the schema 
const graphql = require('graphql');
//const con = require('../database/db');
const _=require('lodash');
const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList,GraphQLNonNull} = graphql;

// Import the Mongoose models
const Book = require('../models/book');
const Author = require('../models/author');



const BookType = new GraphQLObjectType({

    name: 'Book',
    fields: () =>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parents,args){
                //return _.find(authors,{id: parents.AuthorId});
                return Author.findById(parents.authorId);
            }
        }
        
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () =>({
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        id: {type: GraphQLID},
        books: {
            type: new GraphQLList(BookType),  // GraphQLList(BookType) i.e since some of the authors wrote more than 1 book so we are using the list
            resolve(parents,args){
                //return  _.filter(books,{AuthorId: parents.id}); // filter bcs we are selecting more than 1 value 
                return Book.find({authorId: parents.id});
            }
        }
    })
});

// Defining how we initially jump in the graph
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // Quering info realted to Books
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parents,args){
                // Code for accessing the db/other source
                //return _.find(books,{id:args.id});
                return Book.findById(args.id);
            }
        },
        // Quering info realted to Authors
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parents,args){
                //return _.find(authors,{id: args.id});
                return Author.findById(args.id);
            }
        },

        // Returning the whole list of the books
        books: {
            type: new GraphQLList(BookType),
            resolve(parents,args){
                //return books;
                return Book.find({});
            }
        },
        // Returning the whole list of the Authors
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parents,args){
                //return authors;
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)}, //'GraphQLNonNull' tells that don't do mutation if this record is not given 
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parents,args){
                let author = new Author({  // 'Author' is the schema that we imported at the top
                    name: args.name,
                    age: args.age
                });

                return author.save();  // Since after saving mongoose returns an object containing data same as what we saved
            }

        },

        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLID)}
            },

            resolve(parents,args){
                let newbook = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });

                return newbook.save();
            }
        }
    }
});




module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});