import { useRef, useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import * as faceapi from 'face-api.js';


const FaceDetectionPanel = () => {

    const videoRef = useRef();
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    const [DominantExpressions, setDominantExpressions] = useState(null);
    const [IsDetected, setIsDetected] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            try {
                console.log('Loading models...');
                await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
                await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
                await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
                await faceapi.nets.faceExpressionNet.loadFromUri('/models');
                console.log('Models loaded successfully');
                setModelsLoaded(true);
            } catch (err) {
                console.error('Error loading models:', err);
            }
        };
        loadModels();
    }, []);

    const startVideo = async () => {
        try {
            console.log('Starting video...');
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing webcam: ", err);
        }
    };

    useEffect(() => {
        startVideo();
    }, []);

    const handleVideoPlay = () => {
        console.log('Video is playing');
        setVideoReady(true);
    };

    const detectFaces = async () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
            try {
                const detections = await faceapi
                    .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptors()
                    .withFaceExpressions();

                if (detections.length > 0) {
                    console.log(`Detected ${detections.length} face(s)`);

                    const expressions = detections[0].expressions;
                    const dominantExpression = Object.keys(expressions).reduce((a, b) =>
                        expressions[a] > expressions[b] ? a : b
                    );

                    const percentage = (expressions[dominantExpression] * 100).toFixed(0) + '%';
                    const capitalizedExpression = dominantExpression.charAt(0).toUpperCase() + dominantExpression.slice(1);

                    setDominantExpressions({
                        expression: capitalizedExpression,
                        percentage: percentage
                    });

                    console.log(`Face 1 - ${dominantExpression.toUpperCase()}:`, {
                        happy: (expressions.happy * 100).toFixed(1) + '%',
                        sad: (expressions.sad * 100).toFixed(1) + '%',
                        angry: (expressions.angry * 100).toFixed(1) + '%',
                        fearful: (expressions.fearful * 100).toFixed(1) + '%',
                        disgusted: (expressions.disgusted * 100).toFixed(1) + '%',
                        surprised: (expressions.surprised * 100).toFixed(1) + '%',
                        neutral: (expressions.neutral * 100).toFixed(1) + '%'
                    });
                }
                !IsDetected && setIsDetected(true);

            } catch (err) {
                console.error('Error during face detection:', err);
            }
        }
    };

    return (
        <div className="flex flex-col h-full">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-semibold text-foreground">Face Detection</h2>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated border border-border">
                    <span className={`w-2 h-2 rounded-full animate-pulse-glow ${videoReady ? 'bg-success' : 'bg-warning'}`} />
                    <span className="text-sm text-muted-foreground">Camera: {videoReady ? 'On' : 'Off'}</span>
                </div>
            </div>

            {/* Webcam Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-background mb-6">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    onPlay={handleVideoPlay}
                    className="w-full h-full"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
            </div>

            {/* Detected Mood */}
            <div className="mb-4">
                <span className="text-sm text-muted-foreground mb-2 block">
                    {!modelsLoaded && ('⏳ Loading models...')}
                    {modelsLoaded && !videoReady && ('📸 Starting camera...')}
                    {modelsLoaded && videoReady && !DominantExpressions && ('👤 No face detected')}
                    {modelsLoaded && videoReady && DominantExpressions && ('Detected Mood')}
                </span>

                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-elevated border border-border">
                    <span className="text-4xl font-semibold text-foreground">{DominantExpressions?.expression || 'Unknown'}</span>
                    <div className="text-right">
                        <span className="text-3xl font-semibold text-foreground">{DominantExpressions?.percentage || '0%'}</span>
                        <span className="block text-sm text-muted-foreground">confidence</span>
                    </div>
                </div>
            </div>

            {/* Metric Chips */}
            <div className="flex gap-3 mb-6">
                <div className="flex-1 px-4 py-3 rounded-xl bg-surface-elevated border border-border text-center">
                    <span className="block text-sm text-foreground font-medium">Lighting: Optimal</span>
                    <span className="text-xs text-muted-foreground">Optimal</span>
                </div>
                <div className="flex-1 px-4 py-3 rounded-xl bg-surface-elevated border border-border text-center">
                    <span className="block text-sm text-foreground font-medium">Face: Centered</span>
                    <span className="text-xs text-muted-foreground">Position</span>
                </div>
                <div className="flex-1 px-4 py-3 rounded-xl bg-surface-elevated border border-border text-center">
                    <span className="block text-sm text-foreground font-medium">FPS: 60</span>
                    <span className="text-xs text-muted-foreground">Frame rate</span>
                </div>
            </div>

            {/* Re-scan Button */}
            <button
                onClick={detectFaces}
                className="w-full py-4 rounded-xl bg-linear-to-r from-accent to-accent/80 hover:border-2 active:scale-95 hover:border-white hover:from-accent/90 hover:to-accent/70 text-foreground font-semibold text-lg transition-all duration-100 ease-in-out flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
            >
                {IsDetected ? <RefreshCw className="w-5 h-5" /> : null}
                {IsDetected ? 'Re-scan' : 'Start Detection'}
            </button>
        </div>
    );
}

export default FaceDetectionPanel