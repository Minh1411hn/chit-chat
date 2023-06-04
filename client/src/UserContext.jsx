import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [resetPassword, setResetPassword] = useState(false);
    const [resetPasswordMessage, setResetPasswordMessage] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            axios.get(`/api/reset-password/${token}`)
                .then((response) => {
                    if (response.status === 200) {
                        setId(response.data.userId);
                        setEmail(response.data.email);
                        setUsername(response.data.username);
                        setAvatar(response.data.avatar);
                        setResetPasswordMessage(response.data.message);
                        setResetPassword(true)
                    } else {
                        setResetPassword(true);
                        setResetPasswordMessage(response.data.message);
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        setResetPassword(true);
                        setResetPasswordMessage(error.response.data.message);
                    } else {
                        console.error(error);
                        setResetPasswordMessage('Internal server error');
                    }
                });
        } else {
            axios.get('/api/profile')
                .then((response) => {
                    setId(response.data.userId);
                    setEmail(response.data.email);
                    setUsername(response.data.username);
                    setAvatar(response.data.avatar);
                })
                .catch((error) => {
                    console.error('');
                });
        }
    }, []);


    return (
        <UserContext.Provider
            value={{
                email,
                setEmail,
                id,
                setId,
                username,
                setUsername,
                avatar,
                setAvatar,
                resetPassword,
                setResetPassword,
                resetPasswordMessage,
                setResetPasswordMessage,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
