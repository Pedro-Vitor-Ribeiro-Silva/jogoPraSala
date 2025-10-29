import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { SURPRISE_MESSAGE_PARTS } from '../constants';

type SurprisePhase = 'alert' | 'message' | 'finished' | 'congratulations';

const Surprise: React.FC = () => {
    const [phase, setPhase] = useState<SurprisePhase>('alert');
    const [displayedText, setDisplayedText] = useState<string[]>([]);
    const [noButtonPosition, setNoButtonPosition] = useState({
        position: 'relative' as const,
        top: 'auto',
        left: 'auto',
        transition: 'top 0.2s, left 0.2s'
    });

    // 🔊 Toca o som quando muda de fase
    useEffect(() => {
        if (phase === 'alert') {
            const sirenAudio = document.getElementById('siren-audio') as HTMLAudioElement;
            sirenAudio?.play().catch(e => console.error("Audio play failed", e));

            const timer = setTimeout(() => setPhase('message'), 5000);
            return () => clearTimeout(timer);
        }

        if (phase === 'message') {
            const messageAudio = document.getElementById('message-audio') as HTMLAudioElement;
            messageAudio?.play().catch(e => console.error("Audio play failed", e));

            const timings = [1000, 3000, 5500, 8000, 10500];
            const timeouts = timings.map((time, index) =>
                setTimeout(() => {
                    setDisplayedText(prev => [...prev, SURPRISE_MESSAGE_PARTS[index]]);
                    if (index === SURPRISE_MESSAGE_PARTS.length - 1) {
                        setPhase('finished');
                    }
                }, time)
            );

            return () => timeouts.forEach(clearTimeout);
        }
    }, [phase]);

    // 🔊 Novo useEffect: toca som quando chega na fase "congratulations"
    useEffect(() => {
        if (phase === 'congratulations') {
            const audio = document.getElementById('congratulations-audio') as HTMLAudioElement;
            audio?.play().catch(e => console.error("Audio play failed", e));
        }
    }, [phase]);

    const handleNoButtonHover = () => {
        const newTop = Math.random() * 80 + 10;
        const newLeft = Math.random() * 80 + 10;
        setNoButtonPosition({
            position: 'absolute',
            top: `${newTop}%`,
            left: `${newLeft}%`,
            transition: 'top 0.2s, left 0.2s'
        });
    };

    const handleYesClick = () => setPhase('congratulations');
    const handleNoClick = () => alert("Essa opção não é uma opção!");

    if (phase === 'congratulations') {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-900">
                <Confetti width={window.innerWidth} height={window.innerHeight} />
                <audio id="congratulations-audio" src="/somVitoria.wav" preload="auto"></audio>
                <h1 className="text-4xl sm:text-6xl font-pixel text-green-400">Congratulations!</h1>
            </div>
        );
    }

    const renderContent = () => {
        if (phase === 'alert') {
            return (
                <div className="mb-8">
                    <svg className="w-24 h-24 sm:w-32 sm:h-32 text-yellow-300 mx-auto animate-ping" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h1 className="mt-4 text-4xl sm:text-5xl font-pixel text-yellow-300">ALERTA</h1>
                </div>
            );
        }

        return (
            <>
                <div className="text-white text-2xl sm:text-3xl md:text-5xl font-bold font-pixel leading-relaxed" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                    {displayedText.map((part, index) => (
                        <p key={index} className="mt-7 animate-fade-in-up">
                            {part}
                        </p>
                    ))}
                </div>
                {phase === 'finished' && (
                    <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '1s' }}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button
                                onClick={handleYesClick}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-xl sm:text-2xl font-pixel shadow-lg transform hover:scale-105 transition-transform duration-200">
                                Sim
                            </button>
                            <button
                                onMouseEnter={handleNoButtonHover}
                                onClick={handleNoClick}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg text-xl sm:text-2xl font-pixel shadow-lg transform hover:scale-105 transition-transform duration-200"
                                style={noButtonPosition}
                            >
                                Não
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className={`w-full h-screen flex flex-col items-center justify-center p-4 text-center transition-colors duration-500 ${phase === 'alert' ? 'bg-red-800 animate-pulse' : 'bg-gray-900'}`}>
            <audio id="siren-audio" src="/alerta.wav" preload="auto"></audio>
            <audio id="message-audio" src="/vozEdit.wav" preload="auto"></audio>

            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0"></div>
            <div className="relative z-10 w-full">
                {renderContent()}
            </div>

            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
};

export default Surprise;
