import { useState, useCallback } from 'react';
import { type Score } from '../types';

const SCORES_KEY = 'typingGameScores';

export const useScores = () => {
  const [scores, setScores] = useState<Score[]>(() => {
    try {
      const storedScores = localStorage.getItem(SCORES_KEY);
      return storedScores ? JSON.parse(storedScores) : [];
    } catch (error) {
      console.error("Failed to parse scores from localStorage", error);
      return [];
    }
  });
  
  const saveScores = (newScores: Score[]) => {
      const sortedScores = newScores.sort((a, b) => b.score - a.score).slice(0, 10);
      setScores(sortedScores);
      localStorage.setItem(SCORES_KEY, JSON.stringify(sortedScores));
  }

  const addScore = useCallback((newScore: Score) => {
    const updatedScores = [...scores, newScore];
    saveScores(updatedScores);
  }, [scores]);

  const deleteScore = useCallback((indexToDelete: number) => {
    const updatedScores = scores.filter((_, index) => index !== indexToDelete);
    saveScores(updatedScores);
  }, [scores]);
  
  const clearScores = useCallback(() => {
    setScores([]);
    localStorage.removeItem(SCORES_KEY);
  }, []);

  return { scores, addScore, deleteScore, clearScores };
};
