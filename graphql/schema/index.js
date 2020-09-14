// const {
//     buildSchema
// } = require('graphql')

const { gql } = require('apollo-server-express');
require('events').EventEmitter.defaultMaxListeners = 25


module.exports = gql(`
        type Booking {
            event: Event!
                user: User!
                createdAt: String!
                updatedAt: String!
        }
        type Event {
            _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!
                creator: User!
        }
        type Query {
            events: [Event!] !
                user: [User!] !
                eventUsers: [Event!] !
                booking: [Booking!] !
                login(email :String!,password :String!) : AuthData
        }
        type User {
            _id: ID!
                email: String!
                password: String
            createdEvents: [Event!]
        }
        type AuthData {
            userId : ID!
            token  : String!
            tokenExpiration: Int!
        }
        input EventInput {
            title: String!
                description: String!
                price: Float!
                date: String!
        }
        input UserInput {
            email: String!
                password: String!
        }
        type Mutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
            bookEvent(eventId: ID!): Booking!
                cancelEvent(bookingId: ID!): Event!
        }
        
        `)