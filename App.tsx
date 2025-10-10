
import React, { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';
import Quiz from './components/Quiz';
import Chat from './components/Chat';
import { Language, Topic } from './types';

const App: React.FC = () => {
  const [sessionState, setSessionState] = useState<{
    language: Language | null;
    topic: Topic | null;
    isStarted: boolean;
  }>({
    language: null,
    topic: null,
    isStarted: false,
  });

  const handleStartSession = (language: Language, topic: Topic) => {
    setSessionState({ language, topic, isStarted: true });
  };

  const handleQuitSession = () => {
    setSessionState({ language: null, topic: null, isStarted: false });
  };

  const renderSession = () => {
    if (!sessionState.isStarted || !sessionState.language || !sessionState.topic) {
      return <LanguageSelector onStartSession={handleStartSession} />;
    }

    switch (sessionState.topic) {
      case Topic.Chat:
        return <Chat language={sessionState.language} onQuit={handleQuitSession} />;
      case Topic.Grammar:
      case Topic.Writing:
        return <Quiz language={sessionState.language} topic={sessionState.topic} onQuit={handleQuitSession} />;
      default:
        return <LanguageSelector onStartSession={handleStartSession} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      {renderSession()}
    </div>
  );
};

export default App;