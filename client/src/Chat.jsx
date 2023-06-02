import {useContext, useEffect, useRef, useState} from "react";
import {UserContext} from "./UserContext.jsx";
import {uniqBy} from "lodash";
import axios from "axios";
import Contact from "./Contact.jsx";
import Gravatar from 'react-gravatar';
import LogoImg from '../assets/logo-full.svg';
import DesktopPanel from "./DesktopPanel.jsx";
import PanelMessages from "./PanelMessages.jsx";
import PanelSettings from "./PanelSettings.jsx";
import PanelProfile from "./PanelProfile.jsx";
import MobilePanel from "./MobilePanel.jsx";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

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
    const [isMobile, setIsMobile] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appearance , setAppearance] = useState('light')
    const [searchingPeople, setSearchingPeople] = useState('');
    const [selectedPanelSection, setSelectedPanelSection] = useState('messages');

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

    function handleOpenModal() {
        setIsModalOpen(true);
    }
    function handleCloseModal() {
        setIsModalOpen(false);
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
                createdAt: Date.now(),
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
                createdAt: Date.now(),
            },
        ]);
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
            <DesktopPanel appearance={appearance}
                          isMobile={isMobile}
                          selectedPanelSection={selectedPanelSection}
                          onClick={(selectedPanelSection) =>{
                        setSelectedPanelSection(selectedPanelSection);}
                        }
            />

            <div className={`bg-white flex flex-col border-r-gray-200 border-r-[1px] ${isMobile? (selectedUserId ? "hidden" : "w-full") : "w-[20%]" } md:flex`}>
                {selectedPanelSection === 'messages' ? (
                    <PanelMessages
                        isMobile={isMobile}
                        selectedUserId={selectedUserId}
                        onlinePeopleExclOurUser={onlinePeopleExclOurUser}
                        offlinePeople={offlinePeople}
                        searchingPeople={searchingPeople}
                        setSearchingPeople={setSearchingPeople}
                        setSelectedUserId={setSelectedUserId}
                        setSelectedUsername={setSelectedUsername}
                        setSelectedEmail={setSelectedEmail}
                    />
                ) : selectedPanelSection === 'profile' ? (
                    <PanelProfile isMobile={isMobile}
                                  username={username}
                                  email={email}
                                  id={id}
                                  selectedUserId={selectedUserId} logout={logout}/>
                ) : selectedPanelSection === 'settings' ? (
                    <PanelSettings isMobile={isMobile}/>
                ) : null}
                {isMobile && (
                    <MobilePanel isMobile={isMobile}
                                 selectedPanelSection={selectedPanelSection}
                                 onClick={(selectedPanelSection) => {
                                    setSelectedPanelSection(selectedPanelSection);}
                                 }/>
                )}
            </div>


            {/* conversation section */}
            <div className={`bg-white flex flex-col ${ isMobile ? (selectedUserId ? "w-full" : "hidden") : "w-[76%]"}`}>
                {!!selectedUserId && (
                    // Chatting user info
                    <div className={` bg-white flex items-center border-b-[1px] border-gray-100 pl-5 py-5 ${isMobile? "object-top sticky top-0" :""}`}>
                        {/* Mobile Toggle Button */}
                        { isMobile && selectedUserId && (
                            <button
                                className="md:hidden bg-white p-2 rounded-full shadow mr-5"
                                onClick={()=>{
                                    setSelectedUserId(null);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
                                </svg>
                            </button>
                        )}
                        {/* Mobile Toggle Button */}
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                            <Gravatar email={selectedEmail} default="retro" className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-semibold">{selectedUsername.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                            {onlinePeopleExclOurUser[selectedUserId] && (
                                <p className="text-xs text-gray-500">Active</p>
                            )}
                        </div>
                    </div>
                    // Chatting user info
                )}

                <div className={`flex-grow px-2`}>
                    {!selectedUserId && !isMobile && (
                        <div className="flex h-full flex-grow items-center justify-center">
                            <div className="text-orange-500">&larr; Please Select A Person From The Side Bar</div>
                        </div>
                    )}
                    {!!selectedUserId && (
                        <div className={`relative h-full`}>
                            {/*message section*/}
                            <div className={`overflow-y-scroll overscroll-auto absolute top-0 pt-2 left-0 right-0 bottom-2 ${isMobile? "pt-[10%]" : ""}`}>
                                {messageWithoutDupes.map((message) => {
                                    const messageDate = new Date(message.createdAt);
                                    const today = new Date();

                                    const isToday = messageDate.toDateString() === today.toDateString();
                                    const formattedTime = isToday
                                        ? messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                                        : `${messageDate.toLocaleString('default', { month: 'short', day: 'numeric' })} ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`;

                                    const messageClassName = message.sender === id ? 'text-right' : 'text-left';
                                    const timestampClassName = message.sender === id ? 'text-orange-200' : 'text-gray-400';

                                    return (
                                        <div key={message._id} className={messageClassName}>
                                            <div
                                                className={`text-left inline-block max-w-xl p-2 my-[1.5px] rounded-lg text-sm ${
                                                    message.sender === id ? 'bg-[#ED7A46] text-white' : 'bg-gray-100 text-black'
                                                }`}
                                            >
                                                <p>{message.text}</p>
                                                <p className={`text-[0.65rem] ${timestampClassName}`}>{formattedTime}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={divUnderMessages}></div>
                            {/* message section */}
                            </div>
                        </div>
                    )}
                </div>

                {!!selectedUserId && (
                    <form className={`bg-white border-t-[1px] border-gray-100 flex gap-2 p-5 ${isMobile? "sticky bottom-0 h-[9%]":""}`} onSubmit={sendMessage}>
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