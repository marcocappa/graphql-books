const graphql = require('graphql');
const _ = require('lodash');

const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLID,
    GraphQLList
} = graphql;

// dummy data
let books = [
    {name:"Title of the book", genre:"Fantasy", id: "1", authorId: "1"},
    {name:"Second book", genre:"Math", id: "2", authorId: "1"},
    {name:"Test 3", genre:"Fantasy", id: "3", authorId: "2"},
    {name:"Adventure Book", genre:"Adventure", id: "4", authorId: "1"},
    {name:"Test 4", genre:"Fantasy", id: "5", authorId: "2"},
    {name:"Test 5", genre:"Fantasy", id: "6", authorId: "2"},
    {name:"Test 6", genre:"Fantasy", id: "7", authorId: "2"}
]

let authors = [
    {name:"Author 1", age: 33, id: "1"},
    {name:"Author 2", age: 42, id: "2"}
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author:{
            type: AuthorType,
            resolve(parent, args){
                return _.find(authors, { id:parent.authorId })
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent,args){
                return _.filter(books, { authorId: parent.id })
            }

        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return _.find(books,{id:args.id})
            }
        },
        author: {
            type: AuthorType,
            args:{id: {type: GraphQLID}},
            resolve(parent, args){
                return _.find(authors, {id:args.id});
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent,args){
                return books
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent,args){
                return authors
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})