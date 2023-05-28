import Avatar from "./Avatar.jsx";

export default function Contact({id,email,onClick,selected,online,username}) {
    return (
        <div key={id} onClick={() => onClick(id, username, email)}
             className={"border-b border-gray-100 flex pl-3 h-20 mx-1 my-1 rounded-lg cursor-pointer "+(selected ? 'bg-gray-100' : '')}>
            <div className="flex items-center w-15">
                <Avatar online={online} email={email} userId={id} />
            </div>
            <div className="flex gap-2 pl-5 pt-3">
                <span className="text-gray-800 text-md">{username.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
            </div>
        </div>
    );
}