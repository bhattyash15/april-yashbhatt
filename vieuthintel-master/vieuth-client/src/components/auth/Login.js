/*
 * @author Gaurav Kumar
 */

import React, {useState} from "react";
import {gql, useMutation} from "@apollo/client";

const auth_mutation = gql`
    mutation Login($email:String!, $password:String!) {
        login(input: {email: $email,password: $password}){
            _id
            fullName
            bio
        }
    }
`;

const Login = () => {
    let [email, setEmail] = useState('');
    let [pass, setPass] = useState('');
    let [auth, {data, error, loading}] = useMutation(auth_mutation);
    let [user, setUser] = useState(undefined);

    const login = () => {
        auth({variables: {email: email, password: pass}})
            .then(({data}) => {
                setUser(data.login);
            })
            .catch(e => {
                console.log(e);
            })
    };

    return (
        <div>
            {user ?
                <p>you are logged in as {user.fullName}</p>
                :
                <div>
                    <input type="email" name="email" onChange={e => setEmail(e.target.value)}/>
                    <input type="password" name="pass" onChange={e => setPass(e.target.value)}/>
                    {loading ?
                        <button>Logging</button>
                        :
                        <button onClick={login}>Login</button>
                    }
                </div>
            }

        </div>
    );
};

export default Login;
