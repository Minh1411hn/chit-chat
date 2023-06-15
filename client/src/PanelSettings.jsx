import React, {useContext} from 'react';
import Gravatar from "react-gravatar";
import md5 from "blueimp-md5";
import {UserContext} from "./UserContext.jsx";
// import Accordion from 'react-bootstrap/Accordion';
// import {Card} from "react-bootstrap";
// import * as PropTypes from "prop-types";


function CustomToggle(props) {
    return null;
}

// CustomToggle.propTypes = {
//     eventKey: PropTypes.string,
//     children: PropTypes.node
// };
const PanelSettings = ({isMobile,username,email,id,selectedUserId, logout,avatar}) => {
    const { setAvatar } = useContext(UserContext);


    return (
        <div >
            <div className="border-b-[1px] border-gray-100 pb-10">
                <div className="flex items-center justify-between text-[#ED7A46] gap-2 pl-6 py-5 pb-10 object-top">
                    <span className="font-semibold text-2xl">My Settings</span>
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
                                <Gravatar email={`https://www.gravatar.com/avatar/${md5(email)}?d=retro&s=300`} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover" />
                            )}
                        </div>
                    </form>
                </div>
                <p className="mx-auto text-center text-xl font-semibold pt-4">{username}</p>
                <p className="mx-auto text-center text-sm  pt-1">{email}</p>
            </div>

            <div className=" mx-auto w-5/6 mt-4 space-y-1">
               <div className="">
                    <h1 className="font-semibold text-md">Notifications</h1>

                    <div className="mt-3">
                        <p className="text-sm font-medium">Notify me about...</p>
                        <div className="text-sm space-y-1 mb-3">
                            <input type="radio" id="html" name="fav_language" value="HTML"></input>
                            <label htmlFor="html" className="pl-2">All new messages</label><br></br>
                            <input type="radio" id="html" name="fav_language" value="HTML"></input>
                            <label htmlFor="html" className="pl-2">Direct messages, mentions & keywords</label><br></br>
                            <input type="radio" id="html" name="fav_language" value="HTML"></input>
                            <label htmlFor="html" className="pl-2">Nothing</label><br></br>
                        </div>
                        <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"></input>
                        <label htmlFor="html" className="pl-2 text-sm">Send me email Notifications</label><br></br>

                    </div>

                   <div className="mt-3">
                       <p className="text-sm font-medium">Notify me about...</p>
                       <div className="text-sm space-y-1">
                           <input type="radio" id="html" name="fav_language" value="HTML"></input>
                           <label htmlFor="html" className="pl-2">All new messages</label><br></br>
                           <input type="radio" id="html" name="fav_language" value="HTML"></input>
                           <label htmlFor="html" className="pl-2">Direct messages, mentions & keywords</label><br></br>
                           <input type="radio" id="html" name="fav_language" value="HTML"></input>
                           <label htmlFor="html" className="pl-2">Nothing</label><br></br>
                       </div>
                   </div>




               </div>

            </div>



        </div>
    );
}

export default PanelSettings;