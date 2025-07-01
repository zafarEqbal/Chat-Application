import { useEffect, useRef } from "react";
import React from 'react';
import { useSelector } from "react-redux";

export default function Message({ message }) {
  const scroll = useRef();
  const { authUser, selectedUser } = useSelector((store) => store.user);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // ✅ Check if current user is the sender
  const isSender = message?.SenderId.toString() === (authUser?._id);
    const isSender1 = message?.SenderId.toString() !== (authUser?._id);


  console.log("AuthUser ID:", authUser?._id);
  console.log("Message SenderId:", message?.SenderId);
  return (
    <div ref={scroll}>
      <div className={`chat ${isSender ? 'chat-end' : 'chat-start'}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="User avatar"
              src={isSender ? authUser?.ProfilePhoto : selectedUser?.ProfilePhoto}
            />
          </div>
        </div>

        <div className="chat-header">
          <time className="text-xs opacity-50">12:45</time>
        </div>

        <div className={`chat-bubble ${isSender1 ? 'bg-gray-100 text-black':''}`}>{message?.messages}</div>
      </div>
    </div>
  );
}
