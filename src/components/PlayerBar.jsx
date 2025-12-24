import { SkipBack, Play, Pause, SkipForward, Repeat, Volume2 } from "lucide-react";

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const PlayerBar = ({ nowPlaying, onPlayPause, onVolumeChange }) => {
    const progressPercent = (nowPlaying.progressSeconds / nowPlaying.durationSeconds) * 100;

    return (
        <div className="mt-auto p-4 rounded-xl bg-surface-elevated border border-border">
            <div className="flex items-center gap-4">
                {/* Album Art & Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                        <img
                            src='./assets/album-5.jpg'
                            alt="Now playing album art"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="min-w-0">
                        <h4 className="font-medium text-foreground truncate">{nowPlaying.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">{nowPlaying.artist}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full hover:bg-surface transition-colors text-foreground">
                        <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onPlayPause}
                        className="p-3 rounded-full bg-accent hover:bg-accent/80 transition-colors text-foreground"
                    >
                        {nowPlaying.isPlaying ? (
                            <Pause className="w-5 h-5" />
                        ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                        )}
                    </button>
                    <button className="p-2 rounded-full hover:bg-surface transition-colors text-foreground">
                        <SkipForward className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-surface transition-colors text-muted-foreground hover:text-foreground">
                        <Repeat className="w-4 h-4" />
                    </button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-2 w-32">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${nowPlaying.volume * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-10">
                    {formatTime(nowPlaying.progressSeconds)}
                </span>
                <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                    <div
                        className="h-full bg-accent rounded-full transition-all relative"
                        style={{ width: `${progressPercent}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-foreground border-2 border-accent" />
                    </div>
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right">
                    {formatTime(nowPlaying.durationSeconds)}
                </span>
            </div>
        </div>
    );
};

export default PlayerBar;
