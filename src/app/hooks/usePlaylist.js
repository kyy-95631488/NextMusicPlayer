// hooks/usePlaylist.js
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const usePlaylist = () => {
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let subscription;
    
    const fetchPlaylist = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const user_id = session.user.id;
        const { data, error } = await supabase
          .from("playlist")
          .select("*")
          .eq("user_id", user_id)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        if (data) {
          setPlaylist(data);
        }

        // --- Mulai langganan realtime di sini ---
        subscription = supabase
          .channel('realtime:playlist')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'playlist', filter: `user_id=eq.${user_id}` },
            (payload) => {
              console.log('Realtime payload:', payload);

              if (payload.eventType === 'INSERT') {
                setPlaylist((prev) => [payload.new, ...prev]);
              } 
              if (payload.eventType === 'DELETE') {
                setPlaylist((prev) => prev.filter((track) => track.id !== payload.old.id));
              }
              if (payload.eventType === 'UPDATE') {
                setPlaylist((prev) =>
                  prev.map((track) => (track.id === payload.new.id ? payload.new : track))
                );
              }
            }
          )
          .subscribe();
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  return { playlist, loading, error, setPlaylist };
};

export default usePlaylist;
