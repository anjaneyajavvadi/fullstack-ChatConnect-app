import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE==="development"?"http://localhost:3000":"/";
const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket:null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });

            get().connectSocket();
        } catch (err) {
            if (err.response?.status === 401) {
                console.warn("User is not authenticated.");
            } else {
                console.error("Error checking auth:", err);
            }
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });  // ✅ Fix: Store correct user data
            toast.success("Logged in successfully");

            get().connectSocket();

        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");

            get().disconnectSocket();
        } catch (err) {
            toast.error(err.response?.data?.message || "Logout failed");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in updating profile:", error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: async () => {
        const { authUser, socket } = get();
        if (!authUser || socket?.connected) return;
    
        const newSocket = io(BASE_URL, {
            withCredentials: true,
            transports: ["websocket"],
            query:{
                userId: authUser._id,
            }
        });
        newSocket.on("connect", () => {
            console.log("✅ Connected to Socket.IO:", newSocket.id);
            set({ socket: newSocket }); // ✅ Store socket instance
        });
    
        newSocket.on("disconnect", () => {
            console.log("❌ Disconnected from Socket.IO");
            set({ socket: null });
        });
    
        newSocket.on("connect_error", (err) => {
            console.error("❗ Socket connection error:", err);
        });

        newSocket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds});

        })
    
        newSocket.connect();
        
    },
    

    disconnectSocket:async()=>{
        if(get().socket?.connected) get().socket.disconnect();
    }
}));

export default useAuthStore;
