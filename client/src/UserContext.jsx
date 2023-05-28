import {createContext, useEffect, useState} from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({children}){
    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);
    useEffect(()=>{
        axios.get('/api/profile').then(response => {
           setId(response.data.userId);
           setEmail(response.data.email);
           setUsername(response.data.username);
        });
    },[]);
    return(
        <UserContext.Provider value={{email,  setEmail, id, setId, username, setUsername}}>
            {children}
        </UserContext.Provider>
    );
}