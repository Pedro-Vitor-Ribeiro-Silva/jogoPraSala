import React, { useState, useEffect } from 'react';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import Surprise from './components/Surprise';
import { type Score } from './types';
import { useScores } from './hooks/useScores';

type View = 'menu' | 'game' | 'leaderboard' | 'surprise';

const App: React.FC = () => {
  const [view, setView] = useState<View>('menu');
  const { scores, addScore, deleteScore, clearScores } = useScores();

  const handleGameStart = () => {
    setView('game');
  };
  
  const handleStartSurprise = () => {
    setView('surprise');
  };

  const handleGameOver = (score: Score) => {
    addScore(score);
    setView('leaderboard');
  };

  const renderView = () => {
    switch (view) {
      case 'game':
        return <Game 
          onGameOver={handleGameOver} 
          onStartSurprise={handleStartSurprise}
          isSurpriseGame={scores.length === 5}
        />;
      case 'leaderboard':
        return <Leaderboard 
          scores={scores} 
          onPlayAgain={() => setView('menu')} 
          onDeleteScore={deleteScore}
          onClearScores={clearScores}
        />;
      case 'surprise':
        return <Surprise />;
      case 'menu':
      default:
        return (
          <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center overflow-hidden">
             <div className="absolute inset-0 bg-black opacity-70 z-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
             <div className="absolute inset-0 z-0 opacity-20" style={{backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px'}}></div>

            <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-4xl md:text-6xl font-pixel text-green-400" style={{textShadow: '0 0 10px #10b981, 0 0 20px #10b981'}}>Corrida de Digitação Maluca</h1>
                <p className="mt-4 text-md md:text-lg text-gray-300 font-bold">Seus dedos são rápidos o bastante?</p>
                <div className="mt-12 space-y-6 w-full max-w-xs sm:max-w-sm">
                <button
                    onClick={handleGameStart}
                    className="w-full bg-green-500/20 hover:bg-green-500/40 text-green-300 font-bold py-4 px-6 rounded-lg text-xl sm:text-2xl font-pixel shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-green-400 hover:shadow-[0_0_20px_#10b981]"
                >
                    Jogar
                </button>
                <button
                    onClick={() => setView('leaderboard')}
                    className="w-full bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 font-bold py-4 px-6 rounded-lg text-xl sm:text-2xl font-pixel shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-blue-400 hover:shadow-[0_0_20px_#3b82f6]"
                >
                    Placar
                </button>
                </div>
                 <footer className="absolute -bottom-48 md:-bottom-56 text-gray-500 text-sm">
                    A surpresa é ativada no 6º jogo...
                </footer>
            </div>
          </div>
        );
    }
  };

  return <div className="bg-gray-900 min-h-screen">{renderView()}</div>;
};

export default App;