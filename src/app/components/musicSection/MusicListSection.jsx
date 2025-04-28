"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../../lib/supabase"; // Pastikan Anda sudah menginisialisasi Supabase
import { FaPlusCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; 

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const MusicListSection = ({ setPlaylist }) => {
  const [videoList, setVideoList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("Top Music Phonk");
  const [isLoading, setIsLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState("");
  const [prevPageToken, setPrevPageToken] = useState("");

  const fetchMusic = async (pageToken = "") => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            maxResults: 20,
            q: searchQuery,
            type: "video",
            key: YOUTUBE_API_KEY,
            pageToken
          }
        }
      );

      const videoIds = data.items.map((item) => item.id.videoId).join(",");
      const detailsRes = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "contentDetails",
            id: videoIds,
            key: YOUTUBE_API_KEY
          }
        }
      );

      const videosWithDetails = data.items.map((item) => {
        const detail = detailsRes.data.items.find((v) => v.id === item.id.videoId);
        return {
          ...item,
          contentDetails: detail?.contentDetails || null
        };
      });

      setVideoList(videosWithDetails);
      setNextPageToken(data.nextPageToken || "");
      setPrevPageToken(data.prevPageToken || "");
    } catch (error) {
      console.error("Failed to fetch YouTube data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMusic();
  }, [searchQuery]);

  const addToPlaylist = async (video) => {
    const { data: { session } } = await supabase.auth.getSession(); // Updated method
    
    if (!session) {
      toast.error("You must be logged in to add videos to your playlist.");
      return;
    }
  
    // Update the state to reflect the playlist
    setPlaylist((prev) => {
      if (!prev.find((v) => v.id.videoId === video.id.videoId)) {
        return [...prev, video];
      }
      return prev;
    });
  
    const { error } = await supabase
      .from("playlist")
      .insert([{
        video_id: video.id.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        duration: video.contentDetails ? video.contentDetails.duration : "00:00",
        user_id: session.user.id
      }]);
  
    if (error) {
      console.error("Error inserting video into Supabase:", error);
    } else {
      console.log("Video added to playlist in Supabase");
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return "00:00";
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "00:00";
    const [, h = 0, m = 0, s = 0] = match.map((val) => parseInt(val, 10) || 0);
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  };

  return (
    <>
      <ToastContainer />
      <motion.section className="bg-gray-900 text-white py-12 px-4 md:px-10 rounded-lg">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-8">Top Music</h2>
        <div className="flex justify-center mb-8">
          <motion.input
            type="text"
            placeholder="Search Music..."
            className="px-4 py-2 w-1/2 rounded-full text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videoList.map((video) => (
            <motion.div key={video.id.videoId} className="bg-gray-800 rounded-lg overflow-hidden shadow-sm transform origin-center">
              <div className="relative">
                <img
                  src={video.snippet.thumbnails.high.url}
                  alt={video.snippet.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-xs px-2 py-1 rounded">
                  {formatDuration(video.contentDetails?.duration)}
                </div>
              </div>
              <div className="p-4 flex flex-col justify-between h-40">
                <h3 className="text-md font-semibold text-white line-clamp-2">{video.snippet.title}</h3>
                <button
                  onClick={() => addToPlaylist(video)}
                  className="mt-4 flex items-center self-end text-blue-500 hover:text-blue-400 hover:scale-110 transition-all"
                >
                  <FaPlusCircle size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-between mt-6">
  {prevPageToken && (
    <button
      onClick={() => fetchMusic(prevPageToken)}
      className="text-blue-500 hover:text-blue-400 flex items-center gap-2"
    >
      <FaChevronLeft size={20} /> {/* Left chevron icon */}
      Previous
    </button>
  )}
  {nextPageToken && (
    <button
      onClick={() => fetchMusic(nextPageToken)}
      className="text-blue-500 hover:text-blue-400 flex items-center gap-2"
    >
      Next
      <FaChevronRight size={20} /> {/* Right chevron icon */}
    </button>
  )}
</div>
      </motion.section>
    </>
  );
};

export default MusicListSection;
