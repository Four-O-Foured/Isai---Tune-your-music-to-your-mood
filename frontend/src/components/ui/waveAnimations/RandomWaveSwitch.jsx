import { useState, useEffect } from 'react';
import RippleWave from './Pulsing_Ripple';
import ParticleWave from './ParticleWave';
import ZigzagWave from './ZigZagWave';
import FrequencyBars from './FreuencyBar';
import SpirographWave from './SpirographWave';
import WaveformGSAP from './WaveForm'; // Correct path to src/components/WaveForm

const RandomWaveSwitcher = (props) => {
    const [currentWave, setCurrentWave] = useState(0);
    const waves = [
        <RippleWave key="ripple" {...props} />,
        <ParticleWave key="particle" {...props} />,
        <ZigzagWave key="zigzag" {...props} />,
        <FrequencyBars key="frequency" {...props} />,
        <SpirographWave key="spirograph" {...props} />,
        <WaveformGSAP key="classic" {...props} />
    ];

    useEffect(() => {
        // Randomly select a wave on mount
        setCurrentWave(Math.floor(Math.random() * waves.length));

        // Optional: Switch randomly every few seconds for variety
        // const interval = setInterval(() => {
        //     setCurrentWave(Math.floor(Math.random() * waves.length));
        // }, 5000); 

        // return () => clearInterval(interval);
    }, []);

    return waves[currentWave];
};

export default RandomWaveSwitcher;
