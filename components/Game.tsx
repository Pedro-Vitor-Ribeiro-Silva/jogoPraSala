import React, { useState, useEffect, useRef, useMemo } from 'react';
import { type Score } from '../types';
import { GAME_DURATION, WORD_LIST } from '../constants';

interface GameProps {
  onGameOver: (score: Score) => void;
  onStartSurprise: () => void;
  isSurpriseGame: boolean;
}

const Game: React.FC<GameProps> = ({ onGameOver, onStartSurprise, isSurpriseGame }) => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  
  // Surprise state
  const [isGlitching, setIsGlitching] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    
    let shuffledWords = [...WORD_LIST].sort(() => Math.random() - 0.5);
    
    if (isSurpriseGame) {
      // Garante que "padrinhos" seja a primeira palavra na 6ª jogatina
      shuffledWords = ["padrinhos", ...shuffledWords.filter(w => w !== "padrinhos")];
    }
    
    setWords(shuffledWords);
  }, [isSurpriseGame]);

  useEffect(() => {
    if (timeLeft > 0 && !isGlitching && !isExploding) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft <= 0) {
      if (isSurpriseGame) {
        triggerSurprise();
      } else {
        endGame();
      }
    }
  }, [timeLeft, isGlitching, isExploding, isSurpriseGame]);

  const currentWord = useMemo(() => words[currentWordIndex] || '', [words, currentWordIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typedValue = e.target.value.toLowerCase();
    
    if (currentWord.substring(0, typedValue.length) !== typedValue) {
        return;
    }

    setInputValue(typedValue);

    if (typedValue === currentWord) {
      if (currentWord === "padrinhos" && isSurpriseGame) {
        triggerSurprise();
        return;
      }
      setScore(s => s + 1);
      setCurrentWordIndex(i => i + 1);
      setInputValue('');
    }
  };
  
  const triggerSurprise = () => {
      const glitchAudio = document.getElementById('glitch-audio') as HTMLAudioElement;
      glitchAudio?.play().catch(e => console.error("Audio play failed", e));
      
      setIsGlitching(true);
      setInputValue('');

      // Duração do efeito de glitch (terremoto)
      setTimeout(() => {
          glitchAudio?.pause();
          glitchAudio.currentTime = 0;
          setIsGlitching(false);
          
          // Inicia a explosão
          const explosionAudio = document.getElementById('explosion-audio') as HTMLAudioElement;
          explosionAudio?.play().catch(e => console.error("Audio play failed", e));
          setIsExploding(true);

          // Duração do efeito de explosão
          setTimeout(() => {
              onStartSurprise();
          }, 1000); 

      }, 4000);
  };

  const endGame = () => {
    setIsGameOver(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onGameOver({ name: playerName.trim(), score });
    }
  };

  const renderWord = () => {
    return currentWord.split('').map((char, index) => {
      let colorClass = 'text-gray-500';
      if (index < inputValue.length) {
        colorClass = char === inputValue[index] ? 'text-green-400' : 'text-red-500';
      }
      return <span key={index} className={colorClass}>{char}</span>;
    });
  };

  if (isGameOver) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
        <h2 className="text-4xl sm:text-5xl font-pixel text-red-500">Tempo Esgotado!</h2>
        <p className="mt-4 text-2xl sm:text-3xl">Sua pontuação: <span className="text-yellow-400">{score}</span></p>
        <form onSubmit={handleFormSubmit} className="mt-8 flex flex-col items-center w-full max-w-xs sm:max-w-sm">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Digite seu nome"
            className="w-full p-3 rounded-lg text-center text-lg sm:text-xl bg-gray-800 border-2 border-gray-600 focus:border-yellow-400 focus:outline-none text-white"
            maxLength={15}
            required
            autoFocus
          />
          <button type="submit" className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg sm:text-xl font-pixel shadow-lg">
            Salvar Placar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`w-screen h-screen bg-gray-900 flex flex-col items-center justify-center font-pixel p-4 overflow-hidden transition-all duration-500 ${isGlitching ? 'glitch-active' : ''} ${isExploding ? 'explosion-active' : ''}`} onClick={() => inputRef.current?.focus()}>
         <div className="absolute inset-0 bg-black opacity-70 z-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
         <audio id="glitch-audio" src="public/terremotocortado.wav" preload="auto"></audio>
         {/* Adicione o caminho para o seu áudio de explosão aqui */}
         <audio id="explosion-audio" src="public/tnt.wav" preload="auto"></audio>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center glitch-item">
        
        <div className="w-full flex flex-col sm:flex-row justify-center text-center sm:justify-between items-center text-lg sm:text-2xl mb-8 sm:mb-12 px-2 sm:px-4 glitch-item">
          <div className="text-white">Pontuação: <span className="text-green-400">{score}</span></div>
          <div className="text-white mt-2 sm:mt-0">Tempo: <span className="text-red-400">{timeLeft}s</span></div>
        </div>

        <div className="min-h-[5rem] w-full flex items-center justify-center text-2xl sm:text-4xl md:text-5xl tracking-wider p-2 mb-8 glitch-item text-center break-words hyphens-auto">
          <p>{renderWord()}</p>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full max-w-2xl p-3 text-xl sm:text-2xl text-center bg-black bg-opacity-50 text-white border-2 border-green-400 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-500/50 glitch-item"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
         <p className="mt-8 text-gray-400 text-xs sm:text-sm glitch-item">Digite a palavra acima para continuar.</p>
      </div>
       <style>{`
            .hyphens-auto {
                hyphens: auto;
                -webkit-hyphens: auto;
            }
            @keyframes glitch-anim {
                0% { transform: translate(0); }
                20% { transform: translate(-5px, 5px) rotate(-2deg); }
                40% { transform: translate(-5px, -5px) skew(5deg, 5deg); }
                60% { transform: translate(5px, 5px) rotate(1deg); }
                80% { transform: translate(5px, -5px) skew(-5deg, -5deg); }
                100% { transform: translate(0); }
            }
            .glitch-active {
                animation: glitch-anim 0.2s infinite;
            }
            .glitch-active .glitch-item:nth-child(1) { transform: translate(-20vw, 15vh) rotate(15deg) scale(0.8); }
            .glitch-active .glitch-item:nth-child(2) { transform: translate(10vw, -25vh) rotate(-10deg) scale(1.2); }
            .glitch-active .glitch-item:nth-child(3) { transform: translate(30vw, 35vh) rotate(5deg) scale(1); }
            .glitch-active .glitch-item:nth-child(4) { transform: translate(-15vw, -10vh) rotate(25deg) scale(1.5); }
            .glitch-active .glitch-item { transition: all 0.5s ease-in-out; }

            @keyframes explosion-flash {
                0% { background-color: #111827; }
                50% { background-color: white; }
                100% { background-color: black; }
            }
            @keyframes explosion-disperse {
                from { transform: scale(1); opacity: 1; }
                to { transform: scale(2); opacity: 0; }
            }
            .explosion-active {
                animation: explosion-flash 1s forwards;
            }
            .explosion-active .glitch-item {
                animation: explosion-disperse 0.5s forwards;
            }
        `}</style>
    </div>
  );
};

export default Game;