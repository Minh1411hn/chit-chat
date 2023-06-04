import RegisterAndLoginForm from "./RegisterAndLoginForm.jsx";
import {useContext} from "react";
import {UserContext} from "./UserContext.jsx";
import Chat from "./Chat"
import ResetPassword from "./ResetPassword.jsx";

export default function Routes() {
    const {email, id, username, resetPassword,avatar, resetPasswordMessage} = useContext(UserContext);



    if ((email && id && username && !resetPassword)){
        return <Chat/>;
    }

    if (resetPassword || resetPasswordMessage ) {
        return <ResetPassword/>
    }

    return (
        <RegisterAndLoginForm/>
    );
}