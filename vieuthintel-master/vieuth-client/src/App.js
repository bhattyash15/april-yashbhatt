import React from 'react';
import logo from './logo.svg';
import './App.css';
import {ApolloClient, HttpLink, InMemoryCache, ApolloProvider} from "@apollo/client";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Login from "./components/auth/Login";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    connectToDevTools: true,
    link: new HttpLink({
        // uri: 'https://vieuth-backend.herokuapp.com/graphql',
        uri:'http://localhost:4000/graphql'
    }),
    fetchOptions: {
        mode: 'no-cors',
    },
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all'
        }
    }
});

function App() {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <Switch>
                    <Route path="/">
                        <Login/>
                    </Route>
                </Switch>
            </BrowserRouter>
        </ApolloProvider>
    );
}

export default App;
