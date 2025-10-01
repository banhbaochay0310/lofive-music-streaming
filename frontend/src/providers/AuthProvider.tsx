/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore.ts";
import { useChatStore } from "@/stores/useChatStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();
  const { initializeLikedSongs, resetLikedSongs } = usePlayerStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        if (token) {
          await checkAdminStatus();
          // init socket
          if (userId) {
            initSocket(userId);
            initializeLikedSongs(userId);
          }
        } else {
          resetLikedSongs();
        }
      } catch (error: any) {
        updateApiToken(null);
        console.log("Failed to get token", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Automatically update token when it changes
    const tokenInterval = setInterval(async () => {
      try {
        const newToken = await getToken();
        updateApiToken(newToken);
      } catch (error) {
        console.log("Token refresh failed", error);
      }
    }, 1000); // Check every second

    initAuth();
    
    return () => {
      clearInterval(tokenInterval);
      resetLikedSongs();
    };

  }, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket, initializeLikedSongs, resetLikedSongs]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
