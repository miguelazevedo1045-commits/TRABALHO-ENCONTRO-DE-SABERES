
import React, { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';
import Quiz from './components/Quiz';
import { Language, Topic } from './types';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<{
    language: Language | null;
    topic: Topic | null;
    isStarted: boolean;
  }>({
    language: null,
    topic: null,
    isStarted: false,
  });

  const handleStartQuiz = (language: Language, topic: Topic) => {
    setQuizState({ language, topic, isStarted: true });
  };

  const handleQuitQuiz = () => {
    setQuizState({ language: null, topic: null, isStarted: false });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      {!quizState.isStarted ? (
        <LanguageSelector onStartQuiz={handleStartQuiz} />
      ) : (
        quizState.language && quizState.topic && (
          <Quiz
            language={quizState.language}
            topic={quizState.topic}
            onQuit={handleQuitQuiz}
          />
        )
      )}
    </div>
  );
};

export default App;
