import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {UserContext} from "./UserContext.jsx";
import Gravatar from "react-gravatar";

export default function RegisterAndLoginForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');
    const [loginError, setLoginError] = useState(null);
    const {setEmail:setLoggedInEmail, setId,setUsername:setLoggedInUsername } = useContext(UserContext);
    const [isMobile, setIsMobile] = useState(false);

    async function handleSubmit(ev) {
        ev.preventDefault();
        const url = isLoginOrRegister === 'register' ? '/api/register' : '/api/login';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) && isLoginOrRegister === "login") {
            setLoginError("Please enter a valid email address");
            return;
        } else if (!password && isLoginOrRegister === "login") {
            setLoginError("Please enter your password");
            return;
        }

        if (!emailRegex.test(email) && isLoginOrRegister === "register") {
            setLoginError("Please enter a valid email address");
            return;
        } else if (!username && isLoginOrRegister === "register") {
            setLoginError("Username must not blank");
            return;
        } else if (!password && isLoginOrRegister === "register") {
            setLoginError("Password must not blank");
            return;
        }


        try {
            const { data } = await axios.post(url, { email, password, username }, { withCredentials: true });
            setLoggedInEmail(email);
            setId(data.id);
            setLoggedInUsername(data.username);
        } catch (error) {
            // Handle the error response from the API
            if (error.response) {
                const { status, data } = error.response;
                console.log(`API error: ${status} - ${data.message}`);
                setLoginError(data.message)
                // Display an error message to the user as needed
            } else {
                console.log(`Network error: ${error.message}`);
                // Display a network error message to the user as needed
            }
        }
    }

    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth;
            const isMobileView = width < 765;
            setIsMobile(isMobileView);
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [])

    return (
        // <div className="bg-gradient-to-b from-[#FEF9EE] to-white h-screen flex items-center justify-center">
        <div className="bg-[#FF7235] h-screen flex items-center justify-center overflow-hidden">
            <div className="bg-white w-[90%] md:w-[500px] mx-auto border rounded-[10px] justify-center items-center">
                <div className={`${isMobile ? "w-4/5 mx-auto" : "w-3/5 mx-auto"}`}>
                    <div className="flex justify-between mt-5 mb-10 mx-auto border-[1px] rounded-md">
                        <button className={`block w-1/2 rounded-md p-2 ${isLoginOrRegister === "login" ? "bg-orange-500" +
                            " drop-shadow-md" +
                            " text-white" : "bg-white text-gray-500"}`} onClick={() => setIsLoginOrRegister("login")}>
                            Sign In
                        </button>
                        <button className={`block w-1/2 rounded-md p-2 ${isLoginOrRegister === "register" ? "bg-orange-500 text-white drop-shadow-md" : "bg-white text-gray-500"}`} onClick={() => setIsLoginOrRegister("register")}>
                            Sign Up
                        </button>
                    </div>
                    <form className="mx-auto" onSubmit={handleSubmit}>
                        {/*<h1 className="text-center uppercase mt-[-50px] pt-20 pb-5 font-bold text-[25px]">Welcome to Chit-Chat</h1>*/}
                        <input value={email}
                               onChange={ev => setEmail(ev.target.value.trim().toLowerCase())}
                               type="text"
                               placeholder="Email"
                               className="w-full rounded-lg p-2 mb-2 border-2 border-[#FEF9EE] mx-auto"/>
                        {isLoginOrRegister === "register" && (
                            <input value={username}
                                   onChange={ev => setUsername(ev.target.value)}
                                   type="text"
                                   placeholder="Username"
                                   className="block w-full rounded-lg p-2 mb-2 border-2 border-[#FEF9EE] mx-auto"/>
                        )}
                        <input value={password}
                               onChange={ev => setPassword(ev.target.value)}
                               type="password"
                               placeholder="Password"
                               className="block w-full rounded-lg p-2 mb-2 border mx-auto"/>
                        {/* Login Error Alert */}
                        {loginError && (
                            <div className=" mx-auto text-md text-center text-red-500 p-2 flex justify-between align-middle">
                                <span className="">{loginError}</span>
                                {loginError === "Email not found" && (
                                    <button onClick={() => setIsLoginOrRegister('register')} className="text-red-500 font-medium underline cursor-pointer">Create one?</button>
                                )}
                                {loginError === "Incorrect password" && (
                                    <button onClick={() => console.log("Reset password")} className="text-red-500 font-medium underline cursor-pointer">Reset password?</button>
                                )}
                            </div>
                        )}

                        <button className="block w-full my-8 rounded-md p-2 bg-orange-500 text-white mx-auto drop-shadow-md">
                            {isLoginOrRegister === "register"? "Sign Up":"Sign In"}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    )
}