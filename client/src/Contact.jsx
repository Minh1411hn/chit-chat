import Avatar from "./Avatar.jsx";

export default function Contact({id,username,onClick,selected,online}) {
    return (
        <div key={id} onClick={() => onClick(id)}
             className={"border-b border-gray-100 flex pl-3 h-20 mx-1 my-1 rounded-lg cursor-pointer "+(selected ? 'bg-gray-100' : '')}>
            <div className="flex items-center w-15">
                <Avatar online={online} username={username} userId={id} />
            </div>
            <div className="flex gap-2 pl-5 pt-3">
                <span className="text-gray-800 text-md">{username.charAt(0).toUpperCase() + username.slice(1)}</span>
            </div>
        </div>
    );
}