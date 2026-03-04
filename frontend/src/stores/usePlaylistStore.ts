/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/lib/axios";
import type { Playlist } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface PlaylistStore {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  isLoading: boolean;

  fetchMyPlaylists: () => Promise<void>;
  fetchPlaylistById: (id: string) => Promise<void>;
  createPlaylist: (title: string) => Promise<void>;
  updatePlaylist: (id: string, title: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  resetPlaylists: () => void;
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,

  fetchMyPlaylists: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/playlists");
      set({ playlists: response.data });
    } catch (error: any) {
      console.error("Failed to fetch playlists:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlaylistById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/playlists/${id}`);
      set({ currentPlaylist: response.data });
    } catch (error: any) {
      console.error("Failed to fetch playlist:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  createPlaylist: async (title: string) => {
    try {
      const response = await axiosInstance.post("/playlists", { title });
      set((state) => ({
        playlists: [response.data, ...state.playlists],
      }));
      toast.success("Playlist created");
    } catch {
      toast.error("Failed to create playlist");
    }
  },

  deletePlaylist: async (id: string) => {
    try {
      await axiosInstance.delete(`/playlists/${id}`);
      set((state) => ({
        playlists: state.playlists.filter((p) => p._id !== id),
        currentPlaylist:
          state.currentPlaylist?._id === id ? null : state.currentPlaylist,
      }));
      toast.success("Playlist deleted");
    } catch {
      toast.error("Failed to delete playlist");
    }
  },

  updatePlaylist: async (id: string, title: string) => {
    try {
      const response = await axiosInstance.put(`/playlists/${id}`, { title });
      set((state) => ({
        playlists: state.playlists.map((p) =>
          p._id === id ? { ...p, title: response.data.title } : p
        ),
        currentPlaylist:
          state.currentPlaylist?._id === id
            ? { ...state.currentPlaylist, title: response.data.title }
            : state.currentPlaylist,
      }));
      toast.success("Playlist renamed");
    } catch {
      toast.error("Failed to rename playlist");
    }
  },

  addSongToPlaylist: async (playlistId: string, songId: string) => {
    try {
      await axiosInstance.post(`/playlists/${playlistId}/songs`, { songId });
      // Refresh current playlist if viewing it
      const current = get().currentPlaylist;
      if (current && current._id === playlistId) {
        get().fetchPlaylistById(playlistId);
      }
      toast.success("Added to playlist");
    } catch {
      toast.error("Failed to add song");
    }
  },

  removeSongFromPlaylist: async (playlistId: string, songId: string) => {
    try {
      await axiosInstance.delete(`/playlists/${playlistId}/songs/${songId}`);
      // Update current playlist if viewing it
      const current = get().currentPlaylist;
      if (current && current._id === playlistId) {
        set({
          currentPlaylist: {
            ...current,
            songs: current.songs.filter((s) => s._id !== songId),
          },
        });
      }
      toast.success("Removed from playlist");
    } catch {
      toast.error("Failed to remove song");
    }
  },

  resetPlaylists: () => {
    set({ playlists: [], currentPlaylist: null });
  },
}));
