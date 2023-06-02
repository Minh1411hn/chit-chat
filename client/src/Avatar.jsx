import Gravatar from 'react-gravatar'
export default function Avatar({userId,email,online}) {
    const colors = ['bg-teal-200', 'bg-red-200',
        'bg-green-200', 'bg-purple-200',
        'bg-blue-200', 'bg-yellow-200',
        'bg-orange-200', 'bg-pink-200', 'bg-fuchsia-200', 'bg-rose-200'];
    const userIdBase10 = parseInt(userId.substring(10), 16);
    const colorIndex = userIdBase10 % colors.length;
    const color = colors[colorIndex];
    return (
        <div className={'w-12 h-12 relative rounded-full flex items-center ' + color}>
            <Gravatar email={email} default="retro" className="text-center w-full h-full object-cover rounded-full"/>
            {online && (
                <div className="absolute w-4 h-4 bg-green-400 bottom-0 right-0 rounded-full border-2 border-[#FDF3E5]"></div>
            )}
            {!online && (
                <div className="absolute w-4 h-4 bg-gray-400 bottom-0 right-0 rounded-full border-2 border-[#FDF3E5]"></div>
            )}
        </div>
    );
}