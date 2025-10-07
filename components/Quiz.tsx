
import React, { useState, useEffect, useCallback } from 'react';
import { Language, Topic, QuizQuestion } from '../types';
import { generateQuizQuestion } from '../services/geminiService';
import Loader from './Loader';

interface QuizProps {
  language: Language;
  topic: Topic;
  onQuit: () => void;
}

const Quiz: React.FC<QuizProps> = ({ language, topic, onQuit }) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const fetchNextQuestion = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSelectedAnswer(null);
    setIsAnswered(false);
    try {
      const question = await generateQuizQuestion(language, topic);
      setCurrentQuestion(question);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  }, [language, topic]);

  useEffect(() => {
    fetchNextQuestion();
  }, [fetchNextQuestion]);

  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option === currentQuestion?.correctAnswer) {
      setScore((prevScore) => prevScore + 10);
    }
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700';
    }
    if (option === currentQuestion?.correctAnswer) {
      return 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-800 dark:text-green-200';
    }
    if (option === selectedAnswer) {
      return 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-200';
    }
    return 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 opacity-60';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <span className="text-xl font-bold text-blue-500">Pontuação: {score}</span>
          </div>
          <button
            onClick={onQuit}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-semibold transition-colors"
          >
            Sair
          </button>
        </header>

        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
          {isLoading && <Loader />}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!isLoading && !error && currentQuestion && (
            <div className="animate-fade-in">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6">{currentQuestion.question}</h2>
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-lg border-2 font-medium transition-all duration-200 ${getButtonClass(option)} ${!isAnswered && 'cursor-pointer'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {isAnswered && (
          <div className={`mt-6 p-4 rounded-lg animate-fade-in ${selectedAnswer === currentQuestion?.correctAnswer ? 'bg-green-100 dark:bg-green-900/40' : 'bg-red-100 dark:bg-red-900/40'}`}>
            <h3 className={`font-bold text-lg ${selectedAnswer === currentQuestion?.correctAnswer ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
              {selectedAnswer === currentQuestion?.correctAnswer ? 'Correto!' : 'Incorreto!'}
            </h3>
            {selectedAnswer !== currentQuestion?.correctAnswer && (
              <p className="mt-2 text-slate-700 dark:text-slate-300">
                <span className="font-semibold">Explicação:</span> {currentQuestion?.explanation}
              </p>
            )}
            <button
              onClick={fetchNextQuestion}
              className="mt-4 w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Próxima Pergunta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
