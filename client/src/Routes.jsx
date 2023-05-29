import RegisterAndLoginForm from "./RegisterAndLoginForm.jsx";
import {useContext} from "react";
import {UserContext} from "./UserContext.jsx";
import Chat from "./Chat"

export default function Routes() {
    const {email, id, username} = useContext(UserContext);

    if (email && id && username){
        return <Chat/>;
    }

    return (
        <RegisterAndLoginForm/>
    );
}