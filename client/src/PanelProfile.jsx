import React, {useContext, useEffect, useState} from 'react';
import Gravatar from "react-gravatar";
import axios from "axios";
import {UserContext} from "./UserContext.jsx";
import md5 from "blueimp-md5";
import FileResizer from "react-image-file-resizer";



const PanelProfile = ({isMobile,username,email,id,selectedUserId, logout,avatar}) => {
    const [profileMode, setProfileMode] = useState('view');
    const { setAvatar } = useContext(UserContext);



    function uploadAvatar(ev) {
        const file = ev.target.files[0];

        FileResizer.imageFileResizer(
            file,
            300, // maxWidth
            300, // maxHeight
            'JPEG', // compressFormat
            80, // quality
            0, // rotation
            (resizedFile) => {
                const formData = new FormData();
                formData.append('file', resizedFile);
                formData.append('userId', id);
                formData.append('username', username);
                formData.append('email', email);

                axios
                    .post('/api/upload/avatar', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    })
                    .then((response) => {
                        const imageUrl = response.data.imageUrl;
                        console.log('Image URL:', imageUrl);
                        setAvatar(imageUrl);
                    })
                    .catch((error) => {
                        console.log('Upload error:', error.response.data);
                    });
            },
            'blob' // outputType
        );
    }




    return (
        <div className="" >

            <div className="flex items-center justify-between text-[#ED7A46] gap-2 pl-6 py-5 pb-10 object-top">
                <span className="font-semibold text-2xl">My Profile</span>
                {/*logout button*/}
                <div  onClick={logout} className="bg-white border-[1px] justify-end border-red-500 mr-10 rounded-full px-2 py-1 flex cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="red" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
                    </svg>
                    <p className="text-red-500 text-sm pl-1">Log Out</p>
                </div>
            </div>


            <div className=" mx-auto items-center flex flex-col">
                <form className={'w-2/5 h-3/5 flex flex-col relative rounded-lg flex items-center'}>
                    <div className="w-40 h-40 relative rounded-full border-4 border-gray-200 overflow-hidden">
                        {avatar? (
                            <img
                                src={avatar}
                                alt=""
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
                            />
                        ) : (
                            <Gravatar email={`https://www.gravatar.com/avatar/${md5(email.toLowerCase())}?d=retro&s=300`} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover" />
                        )}
                    </div>
                    <label htmlFor="fileInput" className=" bg-orange-500 absolute bottom-0 border-2 border-white right-4 p-[5px] rounded-full cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg"
                             fill="none"
                             viewBox="0 0 24 24"
                             strokeWidth="1.5"
                             stroke="white"
                             className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                        </svg>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        id="fileInput"
                        className="hidden"
                        onChange={uploadAvatar}
                    />
                </form>
            </div>
            <p className="mx-auto text-center text-lg font-semibold pt-4">{username}</p>

            <form className="w-4/5 mx-auto">
                <div className="flex flex-col mb-4">
                    <label className="mb-1 pl-2 text-sm text-gray-500" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="text"
                        placeholder={email}
                        value={email}
                        disabled={true}
                        className="block w-full rounded-lg p-2 bg-gray-100"
                    />
                </div>

                <div className="flex flex-col mb-4">
                    <label className="mb-1 pl-2 text-sm text-gray-500" htmlFor="password">Password</label>
                    <input id="password1"
                           type="password"
                           placeholder="Old Password"
                           className="block w-full rounded-lg p-2 bg-gray-100 mb-2"/>
                    <input id="password"
                           type="password2"
                           placeholder="Enter New Password"
                           className="block w-full rounded-lg p-2 bg-gray-100 mb-2"/>
                    <input id="password"
                           type="password3"
                           placeholder="Re-Enter New Password"
                           className="block w-full rounded-lg p-2 bg-gray-100"/>
                </div>
                <button className="flex mx-auto p-2 mb-20 bg-orange-500 text-white text-sm rounded-lg">
                    Change Password
                </button>
            </form>
        </div>
    );
}

export default PanelProfile;