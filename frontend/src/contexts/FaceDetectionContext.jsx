import { createContext, useContext, useState } from 'react';

// Create the context
const FaceDetectionContext = createContext();

/**
 * FaceDetectionProvider - Manages all face detection state
 * 
 * State managed:
 * - dominantExpression: Current detected mood (Happy, Sad, Angry, etc.)
 * - percentage: Confidence level as a percentage string
 * - isDetected: Whether a face has been detected
 * - videoReady: Whether the camera is ready
 * - modelsLoaded: Whether face-api.js models are loaded
 */
export const FaceDetectionProvider = ({ children }) => {
    const [detectionData, setDetectionData] = useState({
        dominantExpression: null,
        percentage: '0%',
        isDetected: false,
        videoReady: false,
        modelsLoaded: false
    });

    /**
     * Update detection data - merges new data with existing state
     * @param {Object} data - Partial object with fields to update
     * 
     * Example usage:
     * updateDetection({ dominantExpression: 'Happy', percentage: '85%' })
     */
    const updateDetection = (data) => {
        setDetectionData(prev => ({
            ...prev,
            ...data
        }));
    };

    /**
     * Reset all detection data to initial state
     * Useful when stopping camera or clearing detection
     */
    const resetDetection = () => {
        setDetectionData({
            dominantExpression: null,
            percentage: '0%',
            isDetected: false,
            videoReady: false,
            modelsLoaded: false
        });
    };

    // Context value that will be available to all consumers
    const value = {
        detectionData,
        updateDetection,
        resetDetection
    };

    return (
        <FaceDetectionContext.Provider value={value}>
            {children}
        </FaceDetectionContext.Provider>
    );
};

/**
 * Custom hook to use face detection context
 * Throws error if used outside of FaceDetectionProvider
 * 
 * Usage in components:
 * const { detectionData, updateDetection, resetDetection } = useFaceDetection();
 */
export const useFaceDetection = () => {
    const context = useContext(FaceDetectionContext);

    if (!context) {
        throw new Error('useFaceDetection must be used within FaceDetectionProvider');
    }

    return context;
};
