import React from 'react';
import { type Score } from '../types';

interface LeaderboardProps {
  scores: Score[];
  onPlayAgain: () => void;
  onDeleteScore: (index: number) => void;
  onClearScores: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores, onPlayAgain, onDeleteScore, onClearScores }) => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-800 text-white p-4">
      <h1 className="text-5xl md:text-6xl font-pixel text-yellow-400 drop-shadow-[0_4px_0_#a16207] mb-8">Placar de Líderes</h1>
      <div className="w-full max-w-md bg-gray-700 rounded-lg shadow-2xl p-6 border-4 border-gray-600">
        {scores.length > 0 ? (
          <ol className="space-y-4">
            {scores.map((score, index) => (
              <li key={index} className="flex justify-between items-center text-xl p-3 bg-gray-800 rounded-md group">
                <span className="font-bold text-yellow-400 w-8">{index + 1}.</span>
                <span className="flex-grow text-left ml-4">{score.name}</span>
                <span className="font-bold text-green-400 mr-4">{score.score}</span>
                <button 
                  onClick={() => onDeleteScore(index)}
                  className="w-8 h-8 flex items-center justify-center bg-red-500/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  aria-label={`Excluir pontuação de ${score.name}`}
                >
                  X
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-center text-gray-400 text-lg">Nenhuma pontuação ainda. Seja o primeiro a jogar!</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onPlayAgain}
          className="mt-12 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-2xl font-pixel shadow-lg transform hover:scale-105 transition-transform duration-200"
        >
          Jogar Novamente
        </button>
        {scores.length > 0 && (
             <button
                onClick={onClearScores}
                className="mt-12 bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-lg transform hover:scale-105 transition-transform duration-200"
             >
                Limpar Placar
            </button>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;