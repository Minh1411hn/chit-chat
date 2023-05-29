import {useContext, useState} from "react";
import axios from "axios";
import {UserContext} from "./UserContext.jsx";
export default function RegisterAndLoginForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');
    const {setEmail:setLoggedInEmail, setId} = useContext(UserContext);
    async function handleSubmit(ev){
         ev.preventDefault();
         const url = isLoginOrRegister ==="register" ? "/api/register" : "/api/login";
         const {data} = await axios.post(url, {email,password,username},{withCredentials:true});
         setLoggedInEmail(email);
         setId(data.id);
         setUsername(data.username);
    }
    return (
        // <div className="bg-gradient-to-b from-[#FEF9EE] to-white h-screen flex items-center justify-center">
        <div className="bg-[#FF7235] h-screen flex items-center justify-center">
            <form className="bg-white w-[500px] mx-auto border rounded-[10px] justify-center items-center" onSubmit={handleSubmit}>
                {/*<h1 className="text-center uppercase mt-[-50px] pt-20 pb-5 font-bold text-[25px]">Welcome to Chit-Chat</h1>*/}
                <div className="flex justify-between w-3/5 mt-5 mb-10 mx-auto border-[1px] rounded-md">
                    <button className={`block w-1/2 rounded-md p-2 ${isLoginOrRegister === "login" ? "bg-orange-500" +
                        " drop-shadow-md" +
                        " text-white" : "bg-white text-gray-500"}`} onClick={() => setIsLoginOrRegister("login")}>
                        Sign In
                    </button>
                    <button className={`block w-1/2 rounded-md p-2 ${isLoginOrRegister === "register" ? "bg-orange-500 text-white drop-shadow-md" : "bg-white text-gray-500"}`} onClick={() => setIsLoginOrRegister("register")}>
                        Sign Up
                    </button>
                </div>
                <input value={email}
                       onChange={ev => setEmail(ev.target.value.trim())}
                       type="text"
                       placeholder="Email"
                       className="block w-3/5 rounded-lg p-2 mb-2 border-2 border-[#FEF9EE] mx-auto"/>
                {isLoginOrRegister === "register" && (
                    <input value={username}
                           onChange={ev => setUsername(ev.target.value.trim())}
                           type="text"
                           placeholder="Username"
                           className="block w-3/5 rounded-lg p-2 mb-2 border-2 border-[#FEF9EE] mx-auto"/>
                )}
                <input value={password}
                       onChange={ev => setPassword(ev.target.value)}
                       type="password"
                       placeholder="Password"
                       className="block w-3/5 rounded-lg p-2 mb-2 border mx-auto"/>
                <button className="block w-3/5 my-8 rounded-md p-2 bg-orange-500 text-white mx-auto drop-shadow-md">
                    {isLoginOrRegister === "register"? "Sign Up":"Sign In"}
                </button>
                <div className="text-center mt-2 pb-10">
                    {isLoginOrRegister === 'register' && (
                        <div>
                            Already a member?
                            <button className="ml-1 text-[#FFA500]" onClick={() => setIsLoginOrRegister('login')}>
                                Login here
                            </button>
                        </div>
                    )}
                    {isLoginOrRegister === 'login' && (
                        <div>
                            Dont have an account?
                            <button className="ml-1 text-[#FFA500]" onClick={() => setIsLoginOrRegister('register')}>
                                Register
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}