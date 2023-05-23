import {useContext, useState} from "react";
import axios from "axios";
import {UserContext} from "./UserContext.jsx";
import './app.css';
export default function RegisterAndLoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('register');
    const {setUsername:setLoggedInUsername, setId} = useContext(UserContext);
    async function handleSubmit(ev){
         ev.preventDefault();
         const url = isLoginOrRegister ==="register" ? "register" : "login";
         const {data} = await axios.post(url, {username,password},{withCredentials:true});
         setLoggedInUsername(username);
         setId(data.id);
    }
    return (
        <div className="bg-gradient-to-b from-[#FEF9EE] to-white h-screen flex items-center justify-center">
            <form className="bg-white w-[500px] mx-100 mb-12 border rounded-[10px] justify-center items-center" onSubmit={handleSubmit}>
                <h1 className="text-center uppercase mb-10 mt-[-50px] pt-20 font-bold text-[25px]">{isLoginOrRegister === "register"? "Register":"login"}</h1>
                <input value={username}
                       onChange={ev => setUsername(ev.target.value.trim())}
                       type="text"
                       placeholder="Username"
                       className="block w-90 rounded-lg p-2 mb-2 border justify-center  justify-center items-center "/>
                <input value={password}
                       onChange={ev => setPassword(ev.target.value)}
                       type="password"
                       placeholder="Password"
                       className="block w-90 rounded-lg p-2 mb-2 border "/>
                <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
                    {isLoginOrRegister === "register"? "Register":"Login"}
                </button>
                <div className="text-center mt-2">
                    {isLoginOrRegister === "register" && (
                        <div>Have an account?
                        <button onClick={()=> setIsLoginOrRegister('login')}>
                        Login Here
                        </button>
                        </div>
                    )}
                    {isLoginOrRegister === "login" && (
                        <div>Create an account?
                            <button onClick={()=> setIsLoginOrRegister('register')}>
                                Sign Up Here
                            </button>
                        </div>
                    )}

                </div>
            </form>
        </div>
    )
}