"use client";

import React, { useState, useEffect } from "react";
import TagPopuler from "./TagPopuler";
import axios from "axios";
import { supabase } from "../../lib/supabase";
import { FaPlusCircle, FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import YouTube from "react-youtube";

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const MusicListSection = ({ setPlaylist }) => {
  const [videoList, setVideoList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("Music Tranding 2025");
  const [isLoading, setIsLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState("");
  const [prevPageToken, setPrevPageToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cachedVideos, setCachedVideos] = useState({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);

  const fetchMusic = async (pageToken = "") => {
    if (cachedVideos[searchQuery] && !pageToken) {
      setVideoList(cachedVideos[searchQuery].videos);
      setNextPageToken(cachedVideos[searchQuery].nextPageToken);
      setPrevPageToken(cachedVideos[searchQuery].prevPageToken);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
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
            pageToken,
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

      setCachedVideos((prevCache) => ({
        ...prevCache,
        [searchQuery]: {
          videos: videosWithDetails,
          nextPageToken: data.nextPageToken || "",
          prevPageToken: data.prevPageToken || ""
        }
      }));

      setVideoList(videosWithDetails);
      setNextPageToken(data.nextPageToken || "");
      setPrevPageToken(data.prevPageToken || "");
    } catch (error) {
      console.error("Failed to fetch YouTube data", error);
      setErrorMessage("Failed to fetch data from YouTube. Please try again later.");
      toast.error("Failed to fetch data from YouTube. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMusic();
  }, [searchQuery]);

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
  };

  const addToPlaylist = async (video) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("You must be logged in to add Musics to your playlist.");
      return;
    }

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
      toast.error("Failed to add music to playlist.");
    } else {
      toast.success("Music successfully added to your playlist!");
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

  const handlePreviewOpen = (videoId) => {
    setCurrentVideoId(videoId);
    setIsPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
    setCurrentVideoId(null);
  };

  const opts = {
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
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
            className="px-4 py-2 w-full sm:w-1/2 rounded-full text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <TagPopuler onTagClick={handleTagClick} />

        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {errorMessage && (
          <div className="text-red-500 text-center mt-4">{errorMessage}</div>
        )}

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videoList.map((video) => (
            <motion.div key={video.id.videoId} className="bg-gray-800 rounded-lg overflow-hidden shadow-sm transform origin-center hover:scale-105 transition-transform duration-300">
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
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => addToPlaylist(video)}
                    className="text-blue-500 hover:text-blue-400 flex items-center gap-2"
                  >
                    <FaPlusCircle size={20} />
                    Add Playlist
                  </button>
                  <button
                    onClick={() => handlePreviewOpen(video.id.videoId)}
                    className="text-blue-500 hover:text-blue-400 flex items-center gap-2"
                  >
                    <FaPlay size={20} />
                    Preview
                  </button>
                </div>
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
              <FaChevronLeft size={20} />
              Previous
            </button>
          )}
          {nextPageToken && (
            <button
              onClick={() => fetchMusic(nextPageToken)}
              className="text-blue-500 hover:text-blue-400 flex items-center gap-2"
            >
              Next
              <FaChevronRight size={20} />
            </button>
          )}
        </div>
      </motion.section>

      {isPreviewOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 bg-opacity-80 rounded-lg p-4 max-w-full sm:max-w-2xl w-full shadow-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Preview</h3>
              <button
                onClick={handlePreviewClose}
                className="text-red-500 hover:text-red-400"
              >
                <FaChevronLeft size={24} />
              </button>
            </div>
            <div className="mt-4 aspect-w-16 aspect-h-9 w-full relative">
              <YouTube videoId={currentVideoId} opts={opts} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicListSection;
