var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {ApolloServer} = require('apollo-server-express');
var mongoose = require('mongoose');
var config = require('./config');
// var session = require('express-session');
var cookieSession = require('cookie-session');
var passport = require('passport');
var {GraphQLLocalStrategy, buildContext} = require('graphql-passport');
var app = express();
const schema = require('./graphql/schema');
var User = require('./models/user');
const resolvers = require('./graphql/resolvers');
const {authorize} = require("./authentication/auth");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const MongoDBStore = require("connect-mongodb-session")(session);
// const DBStore = new MongoDBStore({uri: config.database, collection: 'sessions'});

/* Connection with mongodb using mongoose odm */
mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true}).then((result) => {
    console.log("database connected in development environment");
}).catch((error) => {
    console.log(error);
});

/* passport configuration*/
passport.use(new GraphQLLocalStrategy((email, password, done) => {
    User.findOne({email: email})
        .populate('profile')
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                done(null, user);
            } else {
                done(new Error('Either email or password is incorrect'), null);
            }
        })
        .catch(err => {
            console.log(err);
            done(err, null);
        })
}));


app.use(logger('dev'));
// app.use(session({
//     secret: 'SESSION_SECRET',
//     resave: false,
//     saveUninitialized: false,
//     store: DBStore
// }));

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id)
        .populate('profile')
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            console.log(err);
            done(err, null);
        });
});
app.use('/verify-email', (req, res, next) => {
    let token = req.query.token;
    if (token) {
        jwt.verify(token, config.jwt.secret, function (err, decoded) {
            if (err) {
                res.send(err);
            }
            User.findById(decoded._id)
                .then(user => {
                    if (decoded.email === user.email && token === user.verificationToken) {
                        user.verified = true;
                        user.save()
                            .then(verifiedUser => verifiedUser)
                            .catch(e => {
                                console.log(e);
                                res.send(e);
                            })
                    } else {
                        res.send("not verified")
                    }
                })
                .catch(e => {
                    console.log(e);
                    res.send(e);
                })
        });
    } else {
        res.send("token is not valid")
    }
});
// app.use('/graphql', passport.authorize('graphql-local',{session:true}));
const server = new ApolloServer({
    schema,
    context: ({req, res}) => buildContext({req, res, User}),
    playground: true,
    introspection: true
});

server.applyMiddleware({
    app, cors: {
        credentials: true,
        origin: true
    }, path: '/graphql'
});


module.exports = app;
