import { useFaceDetection } from '../contexts/FaceDetectionContext';
import { useSongs } from '../contexts/SongContext';
import RandomWaveSwitcher from './ui/waveAnimations/RandomWaveSwitch';

const RecommendationPanel = ({ songs, currentSongId, onSongSelect }) => {
  // Access face detection context to show mood-based recommendations
  const { detectionData } = useFaceDetection();
  const { openPlayer } = useSongs();


  const expressionBasedPicks = {
    happy: 'Upbeat picks',
    sad: 'Sad picks',
    angry: 'Gansta picks',
    fearful: 'Scary picks',
    disgusted: 'Disgusted picks',
    surprised: 'Surprised picks',
    neutral: 'Discover New',
  }

  console.log(detectionData);


  return (
    <div className="flex flex-col h-full">
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground">Recommended for your mood</h2>
        <p className="text-sm text-muted-foreground">
          {detectionData.dominantExpression || 'No mood detected'} · {detectionData.dominantExpression ? expressionBasedPicks[detectionData.dominantExpression] : 'Mood-based picks'}
        </p>
      </div>

      {/* Song List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-5 custom-scrollbar">
        {songs.map((song, index) => {
          const isActive = song.id || song._id === currentSongId;

          return (
            <button
              key={song.id || song._id}
              onClick={() => {
                onSongSelect(song.id || song._id);
                openPlayer();
              }}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group text-left ${isActive
                ? "bg-accent/20 border-2 border-accent"
                : "bg-surface-elevated border border-transparent hover:bg-surface hover:border-border"
                }`}
            >
              {/* Album Art */}
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                <img
                  src={song.cover}
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
              <div className="flex items-center gap-3 h-5">
                {isActive ? (
                  <RandomWaveSwitcher width={150} height={25} color="#8b5cf6" />
                ) : (
                  <span className="text-xs text-muted-foreground tracking-widest">
                    ···········
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendationPanel;
