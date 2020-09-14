const express = require('express');
const bodyParser = require('body-parser');
const {ApolloServer} = require('apollo-server-express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');
const app = express();
const buildSchema = require('./graphql/schema/index.js')
const resolver = require('./graphql/resolver/index.js');
const isAuth = require('./middleware/auth');


app.use(bodyParser.json());

app.use(isAuth);



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});


const server = new ApolloServer({
   typeDefs : buildSchema,
   resolvers : resolver
})

server.applyMiddleware({ app });

app.get('/api', (req, res) => res.send('Hello World!'))
// app.use('/api', ApolloServer({
//     schema: buildSchema,
//     rootValue: resolver

// }));



mongoose.connect("mongodb+srv://graphql:graphql123@cluster0.n8q1o.mongodb.net/events?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(res => {
        console.log('connected successfully');
        app.listen(8000);
    }).catch(err => {
        console.log(err, 'Error in Connection');
    });