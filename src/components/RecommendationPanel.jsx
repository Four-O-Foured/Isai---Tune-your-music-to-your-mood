import { ChevronDown, X } from "lucide-react";
import album1 from "../assets/album-1.jpg";
import album2 from "../assets/album-2.jpg";
import album3 from "../assets/album-3.jpg";
import album4 from "../assets/album-4.jpg";
import album5 from "../assets/album-5.jpg";

const albumImages = [album1, album2, album3, album4, album5];

const RecommendationPanel = ({ songs, currentSongId, onSongSelect }) => {
  const getSongWithAlbum = (song, index) => ({
    ...song,
    albumArt: albumImages[index % albumImages.length],
  });

  return (
    <div className="flex flex-col h-full">
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground">Recommended for your mood</h2>
        <p className="text-sm text-muted-foreground">Happy · Upbeat picks</p>
      </div>

      {/* Song List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-5 custom-scrollbar">
        {songs.map((song, index) => {
          const songWithAlbum = getSongWithAlbum(song, index);
          const isActive = song.id === currentSongId;

          return (
            <button
              key={song.id}
              onClick={() => onSongSelect(song.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group text-left ${isActive
                  ? "bg-accent/20 border-2 border-accent"
                  : "bg-surface-elevated border border-transparent hover:bg-surface hover:border-border"
                }`}
            >
              {/* Album Art */}
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                <img
                  src={songWithAlbum.albumArt}
                  alt={`${song.title} album art`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Song Info */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium truncate ${isActive ? "text-foreground" : "text-foreground"}`}>
                  {song.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
              </div>

              {/* Duration / Progress dots */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground tracking-widest">
                  ···········
                </span>
              </div>

              {/* Action Icon */}
              {isActive ? (
                <ChevronDown className="w-5 h-5 text-accent" />
              ) : (
                <X className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendationPanel;
