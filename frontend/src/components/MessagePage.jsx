// import React from 'react'
// import Message from './Message'
// import useGetMessages from '../hooks/useGetMessages';
// import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';
// import { useSelector } from 'react-redux';
// export default function MessagePage() {
//   useGetMessages();
//   useGetRealTimeMessage();

//   const {messages} = useSelector(store=>store.message);
//   if(!messages) return;
//   return (
//     <div className='px-4 flex-1 overflow-auto'>
//       {
//         messages.map((msg, index) => (
//         <Message key={msg._id || index} message={msg} />
//       ))
//       }
     
      
      
//     </div>
//   )
// }
import React, { useEffect, useRef } from 'react';
import Message from './Message';
import useGetMessages from '../hooks/useGetMessages';
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';
import { useSelector } from 'react-redux';

export default function MessagePage() {
  useGetMessages();
  useGetRealTimeMessage();

  const { messages } = useSelector(store => store.message);
  const { selectedUser } = useSelector(store => store.user);
  const { socket } = useSelector(store => store.socket);

  const bottomRef = useRef(null); // 👈 Anchor for scrolling

  // 🔵 Emit 'messageRead' for unread messages from the selected user
  useEffect(() => {
    if (!socket || !selectedUser || !messages?.length) return;

    const unreadMsgs = messages.filter(
      (msg) =>
        msg.SenderId === selectedUser._id &&
        msg.status !== "read"
    );

    unreadMsgs.forEach((msg) => {
      socket.emit("messageRead", msg._id);
    });
  }, [selectedUser, messages, socket]);

  // ✅ Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || messages.length === 0) return null;

  return (
    <div className='px-4 flex-1 overflow-auto'>
      {messages.map((msg, index) => (
        <Message key={msg._id || index} message={msg} />
      ))}
      {/* ✅ Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
