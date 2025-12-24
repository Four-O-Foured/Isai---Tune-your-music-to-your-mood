import React, { useState } from 'react'
import TopBar from '../components/TopBar';
import FaceDetectionPanel from '../components/FaceDetectionPanel';
import RecommendationPanel from '../components/RecommendationPanel';
import PlayerBar from '../components/PlayerBar';
import PixelSnow from '../components/ui/PixelSnow';
const DashBoard = () => {
    const songsMock = [
        { id: "1", title: "Prima", artist: "Nova Lane", duration: "3:12", albumArt: "" },
        { id: "2", title: "Face", artist: "Neon Youth", duration: "2:58", albumArt: "" },
        { id: "3", title: "Scrrila", artist: "City Pulse", duration: "3:41", albumArt: "" },
        { id: "4", title: "Afterglow", artist: "Luna Park", duration: "3:09", albumArt: "" },
        { id: "5", title: "Mange", artist: "Night Arcade", duration: "4:02", albumArt: "" },
        { id: "6", title: "Skyline", artist: "Golden Hour", duration: "3:33", albumArt: "" },
        { id: "7", title: "Pep Talk", artist: "Brightside", duration: "2:47", albumArt: "" },
        { id: "8", title: "Bloom", artist: "Violet Drive", duration: "3:26", albumArt: "" },
        { id: "9", title: "Flashback", artist: "Retro Club", duration: "3:18", albumArt: "" },
        { id: "10", title: "Upbeat Run", artist: "Tempo Crew", duration: "2:55", albumArt: "" },
    ];

    const [currentSongId, setCurrentSongId] = useState("3");
    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(0.7);

    const currentSong = songsMock.find((s) => s.id === currentSongId) || songsMock[0];

    const nowPlaying = {
        songId: currentSongId,
        title: currentSong.title,
        artist: currentSong.artist,
        progressSeconds: 74,
        durationSeconds: 242,
        volume,
        isPlaying,
    };

    const handleRescan = () => {
        console.log("Re-scanning face...");
    };

    const handleSongSelect = (id) => {
        setCurrentSongId(id);
        setIsPlaying(true);
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
    };

    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 lg:p-6 bg-background">
            <PixelSnow
                color="#ffffff"
                flakeSize={0.02}
                minFlakeSize={1.25}
                pixelResolution={800}
                speed={1.2}
                density={0.45}
                direction={160}
                brightness={2}
                variant="snowflake"
                depthFade={8}
                farPlane={20}
            />
            {/* Outer glow container */}
            <div className="w-full max-w-[1280px] z-90 rounded-2xl bg-card border border-border glow-subtle">
                {/* Two-column grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[40%_60%]">
                    {/* Left Column - Face Detection */}
                    <div className="p-6 border-b lg:border-b-0 lg:border-r border-border">
                        <FaceDetectionPanel />
                    </div>

                    {/* Right Column - Music Recommendations */}
                    <div className="p-6 flex flex-col max-h-[760px]">
                        <TopBar />
                        <div className="flex-1 min-h-0 flex flex-col">
                            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
                                <RecommendationPanel
                                    songs={songsMock}
                                    currentSongId={currentSongId}
                                    onSongSelect={handleSongSelect}
                                />
                            </div>
                            <PlayerBar
                                nowPlaying={nowPlaying}
                                onPlayPause={handlePlayPause}
                                onVolumeChange={handleVolumeChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DashBoard