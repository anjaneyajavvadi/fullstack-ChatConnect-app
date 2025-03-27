import React, { useEffect, useRef } from 'react';
import useChatStore from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import useAuthStore from '../store/useAuthStore';

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser,subscribeToMessages,unsubscribeToMessages} = useChatStore();
  const { authUser } = useAuthStore();
  const msgEndRef=useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      return ()=>unsubscribeToMessages();
    }
  }, [selectedUser?._id,getMessages,subscribeToMessages,unsubscribeToMessages]); // ✅ Ensuring it only runs when selectedUser changes


  useEffect(()=>{
    if(msgEndRef.current && messages)
    {
    msgEndRef.current.scrollIntoView({behavior:'smooth'});
    }
  },[messages])

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {

  return (
    <div
      key={message._id}
      className={`chat ${message?.senderId?.toString() === authUser?._id?.toString() ? "chat-end" : "chat-start"}`}
      ref={msgEndRef}
    >
      <div className="chat-image avatar">
        <div className="size-10 rounded-full border">
          <img
            src={
              message.senderId === authUser._id
                ? authUser.profilePic || "/avatar.png"
                : selectedUser?.profilePic || "/avatar.png"
            }
            alt="User Avatar"
          />
        </div>
      </div>
      <div className="chat-header mb-1">
        <time className="text-xs opacity-50">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </time>
      </div>
      <div className="chat-bubble flex flex-col">
        {message.image && (
          <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2" />
        )}
        {message.text && <p>{message.text}</p>}
      </div>
    </div>
  );
})}

      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
