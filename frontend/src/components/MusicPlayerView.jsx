import { useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useSongs } from '../contexts/SongContext';
import gsap from 'gsap';

const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const MusicPlayerView = () => {
    const {
        currentSong,
        isPlaying,
        volume,
        togglePlayPause,
        updateVolume,
        closePlayer,
        currentTime,
        duration,
        seekTo,
        playNext,
        playPrevious
    } = useSongs();


    // Refs for GSAP animations
    const containerRef = useRef(null);
    const albumArtRef = useRef(null);
    const songInfoRef = useRef(null);
    const controlsRef = useRef(null);
    const backButtonRef = useRef(null);
    const previousSongId = useRef(null);

    // Calculate progress percentage
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Handle progress bar seek
    const handleProgressClick = (e) => {
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * duration;
        seekTo(newTime);
    };

    // Handle volume change
    const handleVolumeClick = (e) => {
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        updateVolume(percentage);
    };

    // Entrance animation when component mounts - DRAMATIC POP-IN
    useEffect(() => {
        // ... existing animation code ...
        const ctx = gsap.context(() => {
            // Set initial state to be invisible and small
            gsap.set(containerRef.current, { scale: 0.5, opacity: 0 });
            gsap.set([albumArtRef.current, songInfoRef.current, controlsRef.current], { scale: 0, opacity: 0 });
            gsap.set(backButtonRef.current, { opacity: 0 });

            // Animate panel entrance - pop in from small
            gsap.to(containerRef.current, {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: 'back.out(1.7)'
            });

            // Stagger animate children - dramatic pop with bounce
            gsap.to([albumArtRef.current, songInfoRef.current, controlsRef.current], {
                scale: 1,
                opacity: 1,
                duration: 0.7,
                stagger: 0.15,
                ease: 'back.out(2)',
                delay: 0.15
            });

            // Back button fade in
            gsap.to(backButtonRef.current, {
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out',
                delay: 0.1
            });
        }, containerRef);

        return () => ctx.revert(); // Cleanup
    }, []);

    // Song change animation - MODERN TRANSITION
    useEffect(() => {
        if (previousSongId.current !== null && previousSongId.current !== currentSong?.id) {
            const ctx = gsap.context(() => {
                // Album art: 3D flip effect with blur
                gsap.timeline()
                    .to(albumArtRef.current, {
                        rotationY: 90,
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.4,
                        ease: 'power2.in'
                    })
                    .set(albumArtRef.current, { rotationY: -90, scale: 1.2 })
                    .to(albumArtRef.current, {
                        rotationY: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out'
                    });

                // Song info: Modern cross-fade with horizontal slide
                gsap.timeline()
                    .to(songInfoRef.current, {
                        x: -30,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.in'
                    })
                    .set(songInfoRef.current, { x: 30 })
                    .to(songInfoRef.current, {
                        x: 0,
                        opacity: 1,
                        duration: 0.4,
                        ease: 'power2.out'
                    });

                // Controls: Subtle pulse
                gsap.to(controlsRef.current, {
                    scale: 1.05,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power1.inOut'
                });
            }, containerRef);

            return () => ctx.revert();
        }

        previousSongId.current = currentSong?._id;
    }, [currentSong?._id]);

    // Close animation - POP OUT
    const handleClose = () => {
        gsap.to(containerRef.current, {
            scale: 0.5,
            opacity: 0,
            duration: 0.3,
            ease: 'back.in(1.7)',
            onComplete: closePlayer
        });
    };

    return (
        <div ref={containerRef} className="flex flex-col h-full">
            {/* Header with Back Button */}
            <div ref={backButtonRef} className="mb-6">
                <button
                    onClick={handleClose}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Detection</span>
                </button>
            </div>

            {/* Album Art - Centered and Large */}
            <div className="flex-1 flex items-center justify-center mb-6">
                <div ref={albumArtRef} className="relative">
                    <img
                        src={currentSong?.cover || 'https://via.placeholder.com/400'}
                        alt={`${currentSong?.title} cover art`}
                        className="w-full max-w-md aspect-square rounded-2xl object-cover shadow-2xl shadow-accent/20 hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </div>

            {/* Song Info */}
            <div ref={songInfoRef} className="text-center mb-6">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                    {currentSong?.title || 'No Song Selected'}
                </h2>
                <p className="text-lg text-muted-foreground">
                    {currentSong?.artist || 'Unknown Artist'}
                </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-muted-foreground w-10">
                        {formatTime(currentTime)}
                    </span>
                    <div
                        className="flex-1 h-2 bg-surface-elevated rounded-full cursor-pointer"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="h-full bg-accent rounded-full transition-all relative"
                            style={{ width: `${progressPercent}%` }}
                        >
                            <div className="absolute right-0 top-[45%] -translate-y-1/2 w-18 h-25 rounded-full object-cover">
                                <iframe src="https://giphy.com/embed/AyCbZVuOqD5MA" className="w-full h-full" allowFullScreen></iframe>
                            </div>
                        </div>
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">
                        {formatTime(duration || 0)}
                    </span>
                </div>
            </div>

            {/* Playback Controls */}
            <div ref={controlsRef} className="flex items-center justify-center gap-6 mb-6">
                <button
                    onClick={playPrevious}
                    className="p-3 rounded-full hover:bg-surface transition-all hover:scale-110 text-foreground active:scale-95"
                >
                    <SkipBack className="w-6 h-6" />
                </button>

                <button
                    onClick={togglePlayPause}
                    className="p-5 rounded-full bg-accent hover:bg-accent/80 transition-all active:scale-95 hover:scale-105 text-foreground shadow-lg shadow-accent/30"
                >
                    {isPlaying ? (
                        <Pause className="w-8 h-8" />
                    ) : (
                        <Play className="w-8 h-8 ml-0.5" />
                    )}
                </button>

                <button
                    onClick={playNext}
                    className="p-3 rounded-full hover:bg-surface transition-all hover:scale-110 text-foreground active:scale-95"
                >
                    <SkipForward className="w-6 h-6" />
                </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 px-4">
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <div
                    className="flex-1 h-2 bg-surface-elevated rounded-full overflow-hidden cursor-pointer"
                    onClick={handleVolumeClick}
                >
                    <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${volume * 100}%` }}
                    />
                </div>
                <span className="text-sm text-muted-foreground w-10 text-right">
                    {Math.round(volume * 100)}%
                </span>
            </div>
        </div>
    );
};


export default MusicPlayerView;
