import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from '../routes/axios';

// Create the context
const SongContext = createContext();

/**
 * SongProvider - Manages all songs state and playback
 * 
 * State managed:
 * - songs: Array of all songs
 * - filteredSongs: Songs filtered by current mood
 * - currentSong: Currently playing/selected song
 * - isPlaying: Playback state
 * - volume: Volume level (0-1)
 */
export const SongProvider = ({ children }) => {
    // Dummy initial data
    const initialSongs = [
        { _id: "1", title: "Dangerous", artist: "Michael Jackson", audio: "https://ik.imagekit.io/4O4ed/songs/Dangerous.mp3", mood: "happy", cover: "https://ik.imagekit.io/4O4ed/covers/MJ-cover.png?updatedAt=1767299886732" },
        { _id: "2", title: "Grippin Woodgrain", artist: "Asap Rocky", audio: "https://ik.imagekit.io/4O4ed/songs/A$AP%20Rocky%20-%20Grippin%20Woodgrain%20_DOWNLOAD_.mp3", mood: "neutral", cover: "https://ik.imagekit.io/4O4ed/covers/Asap_cover.jpg?updatedAt=1767299886219" },
        { _id: "3", title: "Rehmani Keeda", artist: "Mc Stan", audio: "https://ik.imagekit.io/4O4ed/songs/MC%20ST%CE%94N%20-%20REHMANI%20KEEDA%20(%20Official%20Audio%20).mp3", mood: "angry", cover: "https://ik.imagekit.io/4O4ed/covers/MC_stan_cover.jpg?updatedAt=1767299886189" },
        { _id: "4", title: "Omw", artist: "FKJ", audio: "https://ik.imagekit.io/4O4ed/songs/Omw.mp3", mood: "happy", cover: "https://ik.imagekit.io/4O4ed/covers/omw_Cover.jpg?updatedAt=1767299886223" },
        { _id: "5", title: "I Feel Like Dying", artist: "Lil Wayne", audio: "https://ik.imagekit.io/4O4ed/songs/Lil%20Wayne%20-%20I%20feel%20like%20dying.mp3", mood: "sad", cover: "https://ik.imagekit.io/4O4ed/covers/ill_wayne_cover.jpg?updatedAt=1767299886389" },
        { _id: "6", title: "B", artist: "Jaden Smith", audio: "https://ik.imagekit.io/4O4ed/songs/B.mp3", mood: "happy", cover: "https://ik.imagekit.io/4O4ed/covers/jaden%20_cover.jpg?updatedAt=1767299886469" },
        { _id: "7", title: "3 Drags", artist: "Vichaar", audio: "https://ik.imagekit.io/4O4ed/songs/3%20DRAGS%20-%20Vichaar.mp3", mood: "happy", cover: "https://ik.imagekit.io/4O4ed/covers/vichaar-cover.jpg?updatedAt=1767299886195" },
        { _id: "8", title: "Suroor", artist: "Frappe Ash", audio: "https://ik.imagekit.io/4O4ed/songs/SUROOR.mp3", mood: "neutral", cover: "https://ik.imagekit.io/4O4ed/covers/suroor-cover.jpg?updatedAt=1767299886224" },
        { _id: "9", title: "Mausambi Drip", artist: "Dhanji", audio: "https://ik.imagekit.io/4O4ed/songs/Mausambi%20Drip.mp3", mood: "surprised", cover: "https://ik.imagekit.io/4O4ed/covers/Dhanji_Da-Cover.jpg?updatedAt=1767299885902" },
        { _id: "10", title: "Mercedes", artist: "Brent Faiyaz", audio: "https://ik.imagekit.io/4O4ed/songs/Brent%20Faiyaz%20-%20MERCEDES%20_Official%20Audio_.mp3", mood: "surprised", cover: "https://ik.imagekit.io/4O4ed/covers/Mercedes_Cover.jpg?updatedAt=1767299886460" },
    ];

    const [songs, setSongs] = useState(initialSongs);
    const [filteredSongs, setFilteredSongs] = useState(initialSongs);
    const [currentSong, setCurrentSong] = useState(null); // Default to song 3
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [isLoading, setIsLoading] = useState(false);
    const [isPlayerViewOpen, setIsPlayerViewOpen] = useState(false);

    // Audio playback state
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Audio element ref
    const audioRef = useRef(new Audio());

    // State refs for event listeners to avoid stale closures
    const stateRef = useRef({
        currentSong: null,
        filteredSongs: initialSongs,
        songs: initialSongs
    });

    // Update refs whenever state changes
    useEffect(() => {
        stateRef.current = { currentSong, filteredSongs, songs };
    }, [currentSong, filteredSongs, songs]);

    /**
     * Audio event handlers
     */
    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleSongEnded = () => {
        // Use ref to get latest state
        const { currentSong, filteredSongs } = stateRef.current;
        const currentIndex = filteredSongs.findIndex(s => s._id === currentSong?._id);

        if (currentIndex !== -1 && currentIndex < filteredSongs.length - 1) {
            playSong(filteredSongs[currentIndex + 1]._id);
        } else if (currentIndex === filteredSongs.length - 1) {
            // Optional: Loop back to first song or just stop?
            // User asked for "next song", if at end usually stops or loops.
            // Let's loop for continuous play or just stop. 
            // If we stop, isPlaying becomes false.
            setIsPlaying(false);
        }
    };

    /**
     * Setup audio element and event listeners
     */
    useEffect(() => {
        const audio = audioRef.current;

        // Set initial volume
        audio.volume = volume;

        // Add event listeners
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleSongEnded);
        audio.addEventListener('play', () => setIsPlaying(true));
        audio.addEventListener('pause', () => setIsPlaying(false));

        // Cleanup on unmount
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleSongEnded);
            audio.pause();
            audio.src = '';
        };
    }, []);

    /**
     * Fetch songs from backend based on mood/expression
     * @param {string} expression - Detected expression (happy, sad, angry, etc.)
     */
    const fetchSongsByMood = async (expression) => {
        if (!expression) {
            setFilteredSongs(songs);
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.get(`/songs?expression=${expression.toLowerCase()}`);
            console.log(response.data);

            if (response.data && response.data.length > 0) {
                // If backend returns songs, use them
                setSongs(response.data);
                setFilteredSongs(response.data);
            } else {
                // Fallback to local filtering if no backend results
                const filtered = songs.filter(song =>
                    song.mood === expression.toLowerCase()
                );
                setFilteredSongs(filtered.length > 0 ? filtered : songs);
            }
        } catch (error) {
            console.error('Error fetching songs by mood:', error);
            // Fallback to local filtering on error
            const filtered = songs.filter(song =>
                song.mood === expression.toLowerCase()
            );
            setFilteredSongs(filtered.length > 0 ? filtered : songs);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Select and play a song
     * @param {string} songId - ID of song to play
     */
    const playSong = (songId) => {
        const song = songs.find(s => s._id === songId) || filteredSongs.find(s => s._id === songId);
        if (song) {
            setCurrentSong(song);
            // Set audio source and play
            audioRef.current.src = song.audio;
            audioRef.current.load();
            audioRef.current.play().catch(err => {
                console.error('Playback error:', err);
            });
        }
    };

    /**
     * Toggle play/pause state
     */
    const togglePlayPause = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    };

    /**
     * Update volume level
     * @param {number} newVolume - Volume level between 0 and 1
     */
    const updateVolume = (newVolume) => {
        const vol = Math.max(0, Math.min(1, newVolume));
        setVolume(vol);
        audioRef.current.volume = vol;
    };

    /**
     * Seek to specific time in song
     * @param {number} time - Time in seconds
     */
    const seekTo = (time) => {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    /**
     * Play next song in queue
     */
    const playNext = () => {
        const currentIndex = filteredSongs.findIndex(s => s._id === currentSong?._id);
        if (currentIndex < filteredSongs.length - 1) {
            playSong(filteredSongs[currentIndex + 1]._id);
        }
    };

    /**
     * Play previous song or restart current
     */
    const playPrevious = () => {
        if (currentTime > 3) {
            // If more than 3 seconds in, restart current song
            audioRef.current.currentTime = 0;
        } else {
            // Go to previous song
            const currentIndex = filteredSongs.findIndex(s => s._id === currentSong?._id);
            if (currentIndex > 0) {
                playSong(filteredSongs[currentIndex - 1]._id);
            }
        }
    };

    /**
     * Reset to all songs (clear filter)
     */
    const clearFilter = () => {
        setFilteredSongs(songs);
    };

    // Context value
    const value = {
        songs,
        filteredSongs,
        currentSong,
        isPlaying,
        volume,
        isLoading,
        fetchSongsByMood,
        playSong,
        togglePlayPause,
        updateVolume,
        clearFilter,
        isPlayerViewOpen,
        openPlayer: () => setIsPlayerViewOpen(true),
        closePlayer: () => {setIsPlayerViewOpen(false); setIsPlaying(false); setCurrentSong(null); audioRef.current.pause();},
        setSongs,
        // Audio playback controls
        currentTime,
        duration,
        seekTo,
        playNext,
        playPrevious,
    };

    return (
        <SongContext.Provider value={value}>
            {children}
        </SongContext.Provider>
    );
};

/**
 * Custom hook to use song context
 * 
 * Usage:
 * const { songs, currentSong, playSong, fetchSongsByMood } = useSongs();
 */
export const useSongs = () => {
    const context = useContext(SongContext);

    if (!context) {
        throw new Error('useSongs must be used within SongProvider');
    }

    return context;
};
