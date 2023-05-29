import {useContext, useEffect, useRef, useState} from "react";
import Avatar from "./Avatar.jsx";
import {UserContext} from "./UserContext.jsx";
import {uniqBy} from "lodash";
import axios from "axios";
import Contact from "./Contact.jsx";
import Gravatar from 'react-gravatar';

export default function Chat() {
    const [ws,setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [offlinePeople, setOfflinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUsername, setSelectedUsername] = useState(null);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [newMessageText, setNewMessageText] = useState('');
    const {email,id,setId,setEmail,username,setUsername } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const divUnderMessages = useRef();
    const wsUrl = import.meta.env.VITE_WS_URL;
    console.log(`usercontext is ${JSON.stringify(username)}`);

    useEffect(() => {
        connectToWs();
    }, [selectedUserId]);
    function connectToWs() {
        // const ws = new WebSocket('ws://localhost:4040/ws');
        const ws = new WebSocket(`${wsUrl}`);
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', () => {
            setTimeout(() => {
                console.log('Disconnected. Trying to reconnect.');
                connectToWs();
                setUsername(username);
            }, 1000);
        });
    }
    function showOnlinePeople(peopleArray) {
        const people = {};

        peopleArray.forEach(({ userId, email, username }) => {
            if (username && email) {
                people[userId] = { email, username };
            }
        });

        setOnlinePeople(people);
    }




    function logout() {
        axios.post('/api/logout',).then(()=> {
            setWs(null);
            setId(null);
            setEmail(null);
        });
    }


    function sendMessage(ev) {
        ev.preventDefault();

        if (newMessageText.trim() === '') {
            // If the input is empty or contains only whitespace, do nothing
            return;
        }

        ws.send(
            JSON.stringify({
                recipient: selectedUserId,
                text: newMessageText,
            })
        );
        setNewMessageText('');
        setMessages((prev) => [
            ...prev,
            {
                text: newMessageText,
                sender: id,
                recipient: selectedUserId,
                _id: Date.now(),
            },
        ]);
    }

    useEffect(()=>{
        const div = divUnderMessages.current;
        if (div) {
            div.scrollIntoView({behavior:'smooth',block:'end'});
        }
    }, [messages]);

    useEffect(()=> {
        axios.get('/api/people').then(rest=>{
            const offlinePeopleArr = rest.data
                .filter(p => p._id !== id)
                .filter(p => !Object.keys(onlinePeople).includes(p._id));
            const offlinePeople = {};
            offlinePeopleArr.forEach(p=> {
               offlinePeople[p._id] = p;
            });
            setOfflinePeople(offlinePeople);
        })
    }, [onlinePeople]);

    useEffect(()=> {
        if (selectedUserId) {
            axios.get('/api/messages/'+selectedUserId).then(res => {
                setMessages(res.data);
            });
        }
    },[selectedUserId ])

    function handleMessage(ev) {
        const messageData = JSON.parse(ev.data);
        console.log({ev,messageData});
        if ('online' in messageData) {
            showOnlinePeople(messageData.online);
        } else if ('text' in messageData) {
            if (messageData.sender === selectedUserId) {
                setMessages(prev => ([...prev, {...messageData}]));
            }
        }
    }

    const onlinePeopleExclOurUser = {...onlinePeople};
    delete onlinePeopleExclOurUser[id];

    const messageWithoutDupes = uniqBy(messages, '_id');

    return (
        <div className="flex h-screen">
            <div className="bg-white w-1/3 flex flex-col">
                <div className="flex-grow border-r-[1px] border-r-gray-200">
                    {/*LOGO*/}
                    <div className="text-[#ED7A46] font-bold text-lg flex gap-2 p-4 pb-10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                        </svg>
                        CHAT CHAT
                    </div>
                    {/*LOGO*/}
                    {Object.keys(onlinePeopleExclOurUser).map(userId => (
                        <Contact id={userId}
                                 key={userId}
                                 online={true}
                                 email={onlinePeopleExclOurUser[userId].email}
                                 username={onlinePeopleExclOurUser[userId].username}
                                 onClick={(userId, username, email) => {
                                     setSelectedUserId(userId);
                                     setSelectedUsername(username);
                                     setSelectedEmail(email);
                                 }}
                                 selected={userId === selectedUserId}/>
                    ))}
                    {Object.keys(offlinePeople).map(userId => (
                        <Contact id={userId}
                                 key={userId}
                                 online={false}
                                 email={offlinePeople[userId].email}
                                 username={offlinePeople[userId].username}
                                 onClick={(userId, username, email) => {
                                     setSelectedUserId(userId);
                                     setSelectedUsername(username);
                                     setSelectedEmail(email);
                                 }}
                                 selected={userId === selectedUserId}/>
                    ))}
                </div>
                <div className="bg-gray-100 rounded-full m-5 mb-2 p-2 text-center flex items-center justify-center">
                    <span className=" mr-2 text-md text-grey-600 flex items-center">
                        <Gravatar email={email} default="retro" className="text-center w-10 mr-2 h-10 object-cover rounded-full"/>
                        {username}
                    </span>
                    <button onClick={logout} className="text-sm bg-red-200 py-1 px-2 text-grey-400 border rounded-md">Log out</button>
                </div>
            </div>
            <div className="flex flex-col bg-[#FDF3E5] w-2/3 ">
                {!!selectedUserId && (
                    // Chatting user info
                    <div className="flex items-center border-b-[1px] border-[#EFE6D8] pl-5 py-5">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                            <Gravatar email={selectedEmail} default="retro" className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-4">
                            <p className="text-lg font-semibold">{selectedUsername.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                            {onlinePeopleExclOurUser[selectedUserId] && (
                                <p className="text-sm text-gray-500">Active</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex-grow px-2">
                    {!selectedUserId && (
                        <div className="flex h-full flex-grow items-center justify-center">
                            <div className="text-orange-500">&larr; Please Select A Person From The Side Bar</div>
                        </div>
                    )}
                    {!!selectedUserId && (
                        <div className="relative h-full">
                            <div className="overflow-y-scroll absolute top-0 pt-2 left-0 right-0 bottom-2">
                                {messageWithoutDupes.map(message => {
                                    const messageDate = new Date(message.createdAt);
                                    const today = new Date();

                                    const isToday = messageDate.toDateString() === today.toDateString();
                                    const formattedTime = isToday
                                        ? messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                                        : `${messageDate.toLocaleString('default', { month: 'short', day: 'numeric' })} ${messageDate.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        })}`;


                                    return (
                                        <div key={message._id} className={message.sender === id ? 'text-right' : 'text-left'}>
                                            <div
                                                className={`text-left inline-block max-w-xl p-2 my-[1.5px] rounded-lg text-sm ${
                                                    message.sender === id ? 'bg-[#ED7A46] text-white' : 'bg-white text-black'
                                                }`}
                                            >
                                                <p className="">{message.text}</p>
                                                {/* TODO: message timstamp */}
                                                {/*<p className="text-[0.65rem]">{formattedTime}</p>*/}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={divUnderMessages}></div>
                            </div>
                        </div>

                    )}
                </div>
                {!!selectedUserId && (
                    <form className="flex gap-2 p-2" onSubmit={sendMessage}>
                        <input type="text"
                               value={newMessageText}
                               onChange={ev => setNewMessageText(ev.target.value)}
                               placeholder="Type Here"
                               className="bg-white flex-grow border p-2 rounded-full"/>
                        <button type="submit" className="bg-[#ED7A46] pl-2 pr-2 text-white rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}