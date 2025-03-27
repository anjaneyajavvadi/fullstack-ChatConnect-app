import { create } from "zustand";

const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "coffee",
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme);
        document.documentElement.setAttribute("data-theme", theme); // ✅ Apply theme globally
        set({ theme });
    },
}));

export default useThemeStore;