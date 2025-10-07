import React, { useState, useEffect } from 'react';
import { SURPRISE_MESSAGE_PARTS } from '../constants';

type SurprisePhase = 'alert' | 'message' | 'finished';

const Surprise: React.FC = () => {
    const [phase, setPhase] = useState<SurprisePhase>('alert');
    const [displayedText, setDisplayedText] = useState<string[]>([]);

    useEffect(() => {
        if (phase === 'alert') {
            const sirenAudio = document.getElementById('siren-audio') as HTMLAudioElement;
            sirenAudio?.play().catch(e => console.error("Audio play failed", e));

            const timer = setTimeout(() => {
                setPhase('message');
            }, 5000); // Duração do alerta: 5 segundos

            return () => clearTimeout(timer);
        }

        if (phase === 'message') {
            const messageAudio = document.getElementById('message-audio') as HTMLAudioElement;
            messageAudio?.play().catch(e => console.error("Audio play failed", e));
            
            // --- AJUSTE OS TEMPOS AQUI ---
            // Sincronize o tempo (em milissegundos) com a sua gravação de áudio.
            const timings = [
                1000,  // "Atenção, Atenção," aparece após 1.0s
                3000,  // "João e Rafael," aparece após 3.0s
                5500,  // "vocês estão sendo convocados..." aparece após 5.5s
                8000,  // "nossos padrinhos de formatura!!" aparece após 8.0s
                10500, // "Vocês aceitam essa missão??" aparece após 10.5s
            ];

            const timeouts = timings.map((time, index) => {
                return setTimeout(() => {
                    setDisplayedText(prev => [...prev, SURPRISE_MESSAGE_PARTS[index]]);
                    if (index === SURPRISE_MESSAGE_PARTS.length - 1) {
                        setPhase('finished');
                    }
                }, time);
            });

            return () => timeouts.forEach(clearTimeout);
        }
    }, [phase]);

    const renderContent = () => {
        if (phase === 'alert') {
            return (
                <div className="mb-8">
                    <svg className="w-32 h-32 text-yellow-300 mx-auto animate-ping" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h1 className="mt-4 text-5xl font-pixel text-yellow-300">ALERTA</h1>
                </div>
            );
        }

        return (
            <>
                <div className="text-white text-3xl md:text-5xl font-bold font-pixel leading-relaxed" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                    {displayedText.map((part, index) => (
                        <p key={index} className="animate-fade-in-up">
                            {part}
                        </p>
                    ))}
                </div>
                 {phase === 'finished' && (
                    <div className="mt-12 flex flex-col md:flex-row gap-6 animate-fade-in-up" style={{ animationDelay: '1s' }}>
                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-2xl font-pixel shadow-lg transform hover:scale-105 transition-transform duration-200">
                            Sim, aceitamos!
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-2xl font-pixel shadow-lg transform hover:scale-105 transition-transform duration-200">
                            Com certeza!
                        </button>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className={`w-full h-screen flex flex-col items-center justify-center p-8 text-center transition-colors duration-500 ${phase === 'alert' ? 'bg-red-800 animate-pulse' : 'bg-gray-900'}`}>
            {/* 
              ===============================================================
              == PONTO IMPORTANTE: COLOQUE SEUS ARQUIVOS DE ÁUDIO AQUI      ==
              ===============================================================
              - Substitua 'caminho/para/sua/sirene.mp3' pelo link do seu áudio de sirene.
              - Substitua 'caminho/para/sua/mensagem.mp3' pelo link do seu áudio gravado.
              - Você pode usar um serviço como o Vocaroo para gravar e obter um link,
                ou hospedar os arquivos em algum lugar.
            */}
            <audio id="siren-audio" src="caminho/para/sua/sirene.mp3" preload="auto"></audio>
            <audio id="message-audio" src="caminho/para/sua/mensagem.mp3" preload="auto"></audio>

            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0"></div>
            <div className="relative z-10">
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