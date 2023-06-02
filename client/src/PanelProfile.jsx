import React from 'react';
import Gravatar from "react-gravatar";



const PanelProfile = ({isMobile,username,email,id,selectedUserId, logout}) => {
    return (
        <div >
            <div className="">
                <Gravatar email={email} className="mx-auto rounded-full" size={70}/>
            </div>
            <form>
                {/*<h1 className="text-center uppercase mt-[-50px] pt-20 pb-5 font-bold text-[25px]">Welcome to Chit-Chat</h1>*/}
                <input
                    type="text"
                    placeholder={username}
                    className="block w-3/5 rounded-lg p-2 mb-2 border-2 border-[#FEF9EE] mx-auto"/>
                <input
                    type="text"
                    placeholder={username}
                    className="block w-3/5 rounded-lg p-2 mb-2 border-2 border-[#FEF9EE] mx-auto"/>
                <input
                    type="password"
                    placeholder="Password"
                    className="block w-3/5 rounded-lg p-2 mb-2 border mx-auto"/>
            </form>

            {/* my profile section */}
                <div className=" bottom-0 bg-gray-100 h-10 rounded-full m-5 mb-2 p-2 text-center flex items-center justify-center">
                    <div className="bg-red-200 py-1 px-2 text-grey-400 border rounded-md cursor-pointer">
                        <span className=" mr-2 text-md text-grey-600 flex items-center">
                        <Gravatar email={email} default="retro" className="text-center w-8 h-8 mr-2 object-cover rounded-full"/>
                            {username}
                    </span>
                    </div>
                    <button onClick={logout} className="text-sm bg-red-200 py-1 px-2 text-grey-400 border rounded-md">Log out</button>
                </div>
            {/* my profile section */}
        </div>
    );
}

export default PanelProfile;