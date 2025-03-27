import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import useAuthStore from "./useAuthStore";

const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null, // ✅ Fixed naming issue
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load users");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => { // ✅ Fix: Use userId correctly
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load messages");
        } finally {
            set({ isMessagesLoading: false }); // ✅ Fix: Correct state reset
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
    
            set({ messages: res.data });
        } catch (err) {
            console.error("Error fetching messages:", err); // ✅ Debugging log
            toast.error(err.response?.data?.message || "Failed to load messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            
            set({ messages: [...messages, res.data] }); // ✅ Append new message correctly
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    },

    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (newMessage) => {
            const { selectedUser } = get();
            if (!selectedUser || newMessage.senderId !== selectedUser._id) return;
            set((state) => ({ messages: [...state.messages, newMessage] }));
        });
    },
    
    unsubscribeToMessages:()=>{
        const socket=useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (user) => {
        if (!user) return;
        set({ selectedUser: user });
        // get().getMessages(user._id); // ✅ Store the whole user object, not just the ID
    }
}));

export default useChatStore;
