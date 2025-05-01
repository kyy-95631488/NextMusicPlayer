"use client";
import React, { useEffect, useState } from "react";

const TagPopuler = ({ onTagClick }) => {
    const [tags, setTags] = useState([]);
    const query = "music";
  
    useEffect(() => {
      const fetchSuggestions = async () => {
        try {
          const encodedUrl = encodeURIComponent(`https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${query}`);
          const proxyUrl = `https://api.allorigins.win/get?url=${encodedUrl}`;
    
          const res = await fetch(proxyUrl);
          const proxyData = await res.json();
          const data = JSON.parse(proxyData.contents);
    
          setTags(data[1].slice(0, 10));
        } catch (err) {
          console.error("Failed to fetch YouTube suggestions via proxy", err);
        }
      };
    
      fetchSuggestions();
    }, []);
  
    return (
      <div className="w-full px-6 py-4">
        <h3 className="text-white text-lg font-semibold mb-2">Tag Pencarian Populer</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              onClick={() => onTagClick(tag)} // <== Tambahkan ini
              className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full hover:bg-blue-700 transition cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  };  

export default TagPopuler;
