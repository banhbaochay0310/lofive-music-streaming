import { create } from "zustand";
import type { Song } from "../types";
import { useChatStore } from "./useChatStore";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  likedSongs: Song[];
  isLoading: boolean;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  playFromQueue: (index: number) => void;
  toggleLikeSong: (song: Song) => void;
  isLiked: (songId: string) => boolean;
  initializeLikedSongs: (userId: string) => void;
  resetLikedSongs: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  likedSongs: [],
  isLoading: false,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }
    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    const songIndex = get().queue.findIndex((s) => s._id === song._id);

    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },

  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;

    const currentSong = get().currentSong;
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity:
          willStartPlaying && currentSong
            ? `Playing ${currentSong.title} by ${currentSong.artist}`
            : "Idle",
      });
    }

    set({
      isPlaying: willStartPlaying,
    });
  },

  playNext: () => {
    const { queue, currentIndex } = get();
    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
        });
      }
      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else {
      set({
        isPlaying: false,
      });

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Idle`,
        });
      }
    }
  },

  playPrevious: () => {
    const { queue, currentIndex } = get();
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
        });
      }
      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      });
    } else {
      set({
        isPlaying: false,
      });

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Idle`,
        });
      }
    }
  },

  playFromQueue: (index: number) => {
    const { queue } = get();
    if (index >= 0 && index < queue.length) {
      const song = queue[index];

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${song.title} by ${song.artist}`,
        });
      }
      set({
        currentSong: song,
        currentIndex: index,
        isPlaying: true,
      });
    }
  },

  toggleLikeSong: async (song: Song) => {
    try {
      // Call API to toggle like status
      await axiosInstance.post(`/liked-songs/${song._id}`);
      
      // Update local state
      const { likedSongs } = get();
      const songIndex = likedSongs.findIndex((s) => s._id === song._id);
      
      let newLikedSongs;
      if (songIndex === -1) {
        newLikedSongs = [...likedSongs, song];
        toast.success("Added to your Liked Songs");
      } else {
        newLikedSongs = likedSongs.filter((s) => s._id !== song._id);
        toast.success("Removed from your Liked Songs");
      }

      set({ likedSongs: newLikedSongs });
    } catch (error) {
      console.error("Failed to toggle like status:", error);
      toast.error("Failed to update Liked Songs");
    }
  },

  isLiked: (songId: string) => {
    const { likedSongs } = get();
    return likedSongs.some((song) => song._id === songId);
  },

  initializeLikedSongs: async (userId: string) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get("/liked-songs");
      set({ likedSongs: response.data });
    } catch (error) {
      console.error("Failed to fetch liked songs:", error);
      toast.error("Failed to load Liked Songs");
      set({ likedSongs: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  resetLikedSongs: () => {
    set({ likedSongs: [] });
  },
}));
