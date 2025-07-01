import React from 'react'
import Message from './Message'
import useGetMessages from '../hooks/useGetMessages';
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';
import { useSelector } from 'react-redux';
export default function MessagePage() {
  useGetMessages();
  useGetRealTimeMessage();

  const {messages} = useSelector(store=>store.message);
  if(!messages) return;
  return (
    <div className='px-4 flex-1 overflow-auto'>
      {
        messages.map((msg, index) => (
        <Message key={msg._id || index} message={msg} />
      ))
      }
     
      
      
    </div>
  )
}
