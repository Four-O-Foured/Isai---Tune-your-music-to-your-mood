import React from 'react'
import TopBar from '../components/TopBar';
import FaceDetectionPanel from '../components/FaceDetectionPanel';
import MusicPlayerView from '../components/MusicPlayerView';
import RecommendationPanel from '../components/RecommendationPanel';
import PixelSnow from '../components/ui/PixelSnow';
import { useSongs } from '../contexts/SongContext';

const DashBoard = () => {
    // Use SongContext instead of local state
    const { songs, currentSong, playSong ,isPlayerViewOpen } = useSongs();

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
                    {/* Left Column - Face Detection or Music Player */}
                    <div className="p-6 border-b lg:border-b-0 lg:border-r border-border">
                        {isPlayerViewOpen ? (
                            <MusicPlayerView />
                        ) : (
                            <FaceDetectionPanel />
                        )}
                    </div>

                    {/* Right Column - Music Recommendations */}
                    <div className="p-6 flex flex-col max-h-[760px]">
                        <TopBar />
                        <div className="flex-1 min-h-0 flex flex-col">
                            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
                                <RecommendationPanel
                                    songs={songs}
                                    currentSongId={currentSong?._id}
                                    onSongSelect={playSong}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DashBoard