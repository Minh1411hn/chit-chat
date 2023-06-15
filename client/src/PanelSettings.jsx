import React, {useContext} from 'react';
import Gravatar from "react-gravatar";
import md5 from "blueimp-md5";
import {UserContext} from "./UserContext.jsx";


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
            <div className="border-b-[1px] border-gray-100">
                <div className="flex items-center justify-between text-[#ED7A46] gap-2 pl-6 py-5 pb-10 object-top">
                    <span className="font-semibold text-2xl">My Settings</span>
                </div>
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