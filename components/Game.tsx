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
  const [showBlueButton, setShowBlueButton] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    
    const shuffledWords = [...WORD_LIST].sort(() => Math.random() - 0.5);
    
    if (isSurpriseGame) {
      // Inject the surprise word at the 4th position (index 3)
      shuffledWords.splice(3, 0, "padrinhos");
    }
    
    setWords(shuffledWords);
  }, [isSurpriseGame]);

  useEffect(() => {
    if (timeLeft > 0 && !isGlitching && !showBlueButton) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft <= 0) {
      endGame();
    }
  }, [timeLeft, isGlitching, showBlueButton]);

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
      setIsGlitching(true);
      setInputValue('');
      setTimeout(() => {
          setIsGlitching(false);
          setShowBlueButton(true);
      }, 4000); // 4 seconds of chaos
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
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <h2 className="text-5xl font-pixel text-red-500">Tempo Esgotado!</h2>
        <p className="mt-4 text-3xl">Sua pontuação: <span className="text-yellow-400">{score}</span></p>
        <form onSubmit={handleFormSubmit} className="mt-8 flex flex-col items-center">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Digite seu nome"
            className="w-80 p-3 rounded-lg text-center text-xl bg-gray-800 border-2 border-gray-600 focus:border-yellow-400 focus:outline-none text-white"
            maxLength={15}
            required
            autoFocus
          />
          <button type="submit" className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-xl font-pixel shadow-lg">
            Salvar Placar
          </button>
        </form>
      </div>
    );
  }
  
  if (showBlueButton) {
      return (
          <div className="w-screen h-screen bg-gray-900 flex items-center justify-center">
              <button 
                onClick={onStartSurprise}
                className="w-3/4 md:w-1/2 h-1/4 bg-blue-600 animate-pulse hover:bg-blue-500 transition-colors"
              ></button>
          </div>
      )
  }

  return (
    <div className={`w-screen h-screen bg-gray-900 flex flex-col items-center justify-center font-pixel p-4 overflow-hidden transition-all duration-500 ${isGlitching ? 'glitch-active' : ''}`} onClick={() => inputRef.current?.focus()}>
         <div className="absolute inset-0 bg-black opacity-70 z-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center glitch-item">
        <div className="w-full flex justify-between items-center text-2xl mb-16 px-4 glitch-item">
          <div className="text-white">Pontuação: <span className="text-green-400">{score}</span></div>
          <div className="text-white">Tempo: <span className="text-red-400">{timeLeft}s</span></div>
        </div>

        <div className="h-20 text-5xl tracking-widest p-4 mb-8 glitch-item">
          {renderWord()}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full max-w-2xl p-4 text-center text-3xl bg-black bg-opacity-50 text-white border-2 border-green-400 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-500/50 glitch-item"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
         <p className="mt-8 text-gray-400 text-sm glitch-item">Digite a palavra acima para continuar.</p>
      </div>
       <style>{`
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
        `}</style>
    </div>
  );
};

export default Game;