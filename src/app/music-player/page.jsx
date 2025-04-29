"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { supabase } from "../lib/supabase";
import ReactPlayer from "react-player/youtube";
import { FaPlayCircle, FaPauseCircle, FaStepBackward, FaStepForward } from "react-icons/fa";
import { FaVolumeDown, FaVolumeUp } from "react-icons/fa"; 
import { FaPlay, FaTrash } from "react-icons/fa";
import { BiRepeat } from "react-icons/bi";
import NavBar from "../components/navBar/NavBar";
import Footer from "../components/footer/Footer";
import ParticlesComponent from "../components/particles/particlesreact";
import usePlaylist from "../hooks/usePlaylist";
import Swal from 'sweetalert2';

const MusicPlayer = () => {
  const { playlist, loading, error, setPlaylist } = usePlaylist();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visibleTracks, setVisibleTracks] = useState(20); // Track yang ditampilkan pertama kali
  const [isDownloading, setIsDownloading] = useState(false);

  const [audioQuality, setAudioQuality] = useState(128);

  const playerRef = useRef(null);
  const audioRef = useRef(null); // Untuk pemutaran audio di background

  useEffect(() => {
    // Handle audio playback for background (Mobile)
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const handleLoopToggle = () => {
    setIsLooping((prev) => !prev);
  };

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (dur) => {
    setDuration(dur);
  };

  const [volume, setVolume] = useState(1.0);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleSeek = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newPlayed = clickX / width;
    if (playerRef.current) {
      playerRef.current.seekTo(newPlayed);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
  
      setIsDownloading(false);
    } catch (error) {
      console.error("Download error", error);
      setIsDownloading(false);
    }
  };

  const handleDeleteTrack = async (trackId) => {
    const result = await Swal.fire({
      title: 'Yakin mau hapus?',
      text: "Lagu ini akan dihapus dari playlist kamu!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });
  
    if (!result.isConfirmed) return;
  
    try {
      const { error } = await supabase
        .from("playlist")
        .delete()
        .eq("id", trackId);
  
      if (error) throw error;
  
      setPlaylist((prev) => prev.filter((track) => track.id !== trackId));
  
      Swal.fire('Terhapus!', 'Lagu sudah dihapus.', 'success');
    } catch (err) {
      console.error(err.message);
      Swal.fire('Error!', 'Gagal menghapus lagu.', 'error');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const loadMoreTracks = useCallback(() => {
    setVisibleTracks((prev) => prev + 20); // Load more tracks when scrolling
  }, []);

  const currentTrack = playlist[currentTrackIndex];

  return (
    <main className="flex min-h-screen flex-col bg-[#121212] overflow-x-hidden w-full relative z-0">
      {/* Navbar */}
      <NavBar playlist={playlist} setPlaylist={() => {}} />

      {/* Music Player Content */}
      <div className="flex-1 flex items-center justify-center p-4 z-0 relative mt-12 sm:mt-24">
        <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg w-full max-w-md flex flex-col items-center">
          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-400">{error}</p>
          ) : currentTrack ? (
            <>
              <h3 className="text-2xl font-bold mb-4 text-center">{currentTrack.title}</h3>
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-full h-full object-cover rounded-xl shadow-md mb-4"
              />

              <ReactPlayer
                ref={playerRef}
                url={`https://www.youtube.com/watch?v=${currentTrack.video_id}`}
                playing={isPlaying}
                controls={false}
                width="0"
                height="0"
                volume={volume}
                loop={isLooping}
                onProgress={handleProgress}
                onDuration={handleDuration}
                style={{ display: "none" }}
              />

              {/* Progress Bar */}
              <div className="w-full flex items-center space-x-2 mb-4">
                <span className="text-xs">{formatTime(currentTime)}</span>
                <div className="flex-1 bg-gray-600 h-2 rounded-full relative cursor-pointer" onClick={handleSeek}>
                  <div
                    className="bg-green-400 h-2 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <span className="text-xs">{formatTime(duration)}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-6">
                <button onClick={handlePrevTrack} className="text-gray-400 hover:text-white transition">
                  <FaStepBackward size={28} />
                </button>
                <button onClick={handlePlayPause} className="text-white hover:scale-110 transition-transform">
                  {isPlaying ? <FaPauseCircle size={48} /> : <FaPlayCircle size={48} />}
                </button>
                <button onClick={handleNextTrack} className="text-gray-400 hover:text-white transition">
                  <FaStepForward size={28} />
                </button>
              </div>

              {/* Loop Button */}
              <button
                onClick={handleLoopToggle}
                className="mt-6 text-gray-400 hover:text-white transition"
              >
                {isLooping ? (
                  <BiRepeat size={28} className="text-green-400" />
                ) : (
                  <BiRepeat size={28} />
                )}
              </button>

              {/* Audio Quality & Download */}
              <div className="flex items-center justify-between gap-3 mt-6 w-full">
                <select
                  value={audioQuality}
                  onChange={(e) => setAudioQuality(parseInt(e.target.value))}
                  className="flex-1 px-2 py-1 border rounded-md bg-gray-700 text-white shadow-sm"
                >
                  <option value={128}>128 kbps</option>
                  <option value={192}>192 kbps</option>
                  <option value={256}>256 kbps</option>
                  <option value={320}>320 kbps</option>
                </select>

                {currentTrack && !isDownloading ? (
                  <a
                    href={`/api/download?id=${currentTrack.video_id}&quality=${audioQuality}`}
                    download
                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md"
                    onClick={handleDownload}
                  >
                    <FaPlay />
                  </a>
                ) : (
                  <div className="p-2 bg-gray-600 text-white rounded-full shadow-md">
                    <span>Loading...</span>
                  </div>
                )}
              </div>

              {/* Volume Slider */}
              <div className="w-full flex items-center gap-4 mt-6">
                  <FaVolumeDown className="text-gray-400" size={20} />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer transition-all duration-300 hover:bg-gray-500"
                    style={{
                      background: `linear-gradient(to right, #34D399 0%, #34D399 ${volume * 100}%, #4B5563 ${volume * 100}%, #4B5563 100%)`,
                    }}
                  />
                  <FaVolumeUp className="text-gray-400" size={20} />
              </div>

            </>
          ) : (
            <p className="text-center text-gray-400">No tracks available in the playlist</p>
          )}
        </div>
      </div>

      {/* Playlist Section with Title */}
      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-xl font-semibold text-white mb-6">Playlist</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {playlist.slice(0, visibleTracks).map((track, index) => (
            <div
              key={index}
              className="bg-gray-800 text-white p-4 rounded-xl shadow-md w-48 text-center"
              style={{ marginBottom: '1rem' }}
            >
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-32 h-32 object-contain rounded-lg mb-4 mx-auto"
              />
              <h4 className="font-semibold text-sm mb-2">{track.title}</h4>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setCurrentTrackIndex(index);
                      setIsPlaying(true);
                    }}
                    className="text-blue-400 hover:text-blue-500 transition"
                    title="Play"
                  >
                    <FaPlay size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteTrack(track.id)}
                    className="text-red-400 hover:text-red-500 transition"
                    title="Delete"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
            </div>
          ))}
        </div>

        <button
          onClick={loadMoreTracks}
          className="text-blue-500 mt-6"
        >
          Load More
        </button>
      </div>

      {/* Footer */}
      <Footer />

      {/* Particles Background */}
      <div id="particles" className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <ParticlesComponent id="particles" />
      </div>
    </main>
  );
};

export default MusicPlayer;
