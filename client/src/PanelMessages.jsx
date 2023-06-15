import React from 'react';
import Contact from './Contact';

const PanelMessages = ({
                           isMobile,
                           selectedUserId,
                           onlinePeopleExclOurUser,
                           offlinePeople,
                           searchingPeople,
                           setSearchingPeople,
                           setSelectedUserId,
                           setSelectedUsername,
                           setSelectedEmail,
                           setSelectedAvatar,
                           setToast,
                       }) => {

    return (
        <>
            <div className={`${isMobile ? "bg-white sticky top-0 object-top z-10 border-gray-100 border-b-2" : ""}`}>
                <div className="flex items-center text-[#ED7A46] font-semibold text-2xl gap-2 pl-6 pr-4 py-5 object-top">
                    <span>Messages</span>
                    <div className="flex items-end ml-auto space-x-5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="#606060" className="w-6 h-6 cursor-pointer" onClick={()=>{setToast(true)}}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="#606060" className="w-6 h-6 cursor-pointer" onClick={()=> {
                            setToast(true)
                        }}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                        </svg>
                    </div>
                </div>
                <div className={`bg-white flex gap-2 px-3 pb-5`} >
                    <input type="text"
                           value={searchingPeople}
                           onChange={ev => setSearchingPeople(ev.target.value)}
                           placeholder="Search"
                           className="bg-gray-100 flex-grow px-4 py-2 rounded-xl text-sm"/>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto">
                <div className="flex flex-col flex-grow">
                    {Object.keys(onlinePeopleExclOurUser).map(userId => {
                        const user = onlinePeopleExclOurUser[userId];
                        const usernameRegex = new RegExp(searchingPeople, 'i');
                        if (!searchingPeople || usernameRegex.test(user.username)) {
                            return (
                                <Contact
                                    id={userId}
                                    key={userId}
                                    online={true}
                                    email={user.email}
                                    username={user.username}
                                    avatar={user.avatar}
                                    onClick={(userId, username, email, avatar) => {
                                        setSelectedUserId(userId);
                                        setSelectedUsername(username);
                                        setSelectedEmail(email);
                                        setSelectedAvatar(avatar);
                                        setSearchingPeople('');
                                    }}
                                    selected={userId === selectedUserId}
                                />
                            );
                        }
                        return null;
                    })}
                    {Object.keys(offlinePeople).map(userId => {
                        const user = offlinePeople[userId];
                        const usernameRegex = new RegExp(searchingPeople, 'i');
                        if (!searchingPeople || usernameRegex.test(user.username)) {
                            return (
                                <Contact
                                    id={userId}
                                    key={userId}
                                    online={false}
                                    email={user.email}
                                    username={user.username}
                                    avatar={user.avatar}
                                    onClick={(userId, username, email, avatar) => {
                                        setSelectedUserId(userId);
                                        setSelectedUsername(username);
                                        setSelectedEmail(email);
                                        setSelectedAvatar(avatar);
                                        setSearchingPeople('');
                                    }}
                                    selected={userId === selectedUserId}
                                />
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </>
    );
};

export default PanelMessages;