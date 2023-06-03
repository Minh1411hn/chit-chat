import Avatar from "./Avatar.jsx";

export default function Contact({id,email,onClick,selected,online,username,avatar}) {
    return (
        <div key={id} onClick={() => onClick(id, username, email,avatar)}
             className={"flex px-3 h-20 mx-3 my-2 rounded-lg cursor-pointer "+(selected ? 'bg-[#FDF3E5]' : '')}>
            <div className="flex items-center w-15">
                <Avatar online={online} email={email} userId={id} avatar={avatar} />
            </div>
            <div className="flex gap-2 pl-5 pt-3">
                <span className="text-gray-800 text-sm font-semibold">{username.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
            </div>
        </div>
    );
}