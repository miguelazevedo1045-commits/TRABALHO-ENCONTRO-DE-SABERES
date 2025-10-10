
import React, { useState } from 'react';
import { Language, Topic } from '../types';
import { LANGUAGES, TOPICS } from '../constants';

interface LanguageSelectorProps {
  onStartSession: (language: Language, topic: Topic) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onStartSession }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleStart = () => {
    if (selectedLanguage && selectedTopic) {
      onStartSession(selectedLanguage, selectedTopic);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <header className="mb-10">
        <h1 className="text-5xl font-bold text-slate-800 dark:text-white">AI Language Quiz</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">Escolha seu caminho para a fluência!</p>
      </header>

      <main className="w-full max-w-2xl">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-200">1. Escolha um idioma</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedLanguage === lang.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50 scale-105 shadow-lg'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md'
                }`}
              >
                <span className="text-4xl">{lang.flag}</span>
                <p className="mt-2 font-semibold text-slate-700 dark:text-slate-200">{lang.name}</p>
              </button>
            ))}
          </div>
        </section>

        {selectedLanguage && (
          <section className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-200">2. Escolha um tópico</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedTopic === topic.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/50 scale-105 shadow-lg'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-green-400 dark:hover:border-green-500 hover:shadow-md'
                  }`}
                >
                   <span className="text-4xl">{topic.icon}</span>
                   <p className="mt-2 font-semibold text-slate-700 dark:text-slate-200">{topic.name}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {selectedLanguage && selectedTopic && (
          <button
            onClick={handleStart}
            className="w-full max-w-xs mx-auto bg-green-500 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg animate-fade-in"
          >
            Iniciar Sessão!
          </button>
        )}
      </main>
    </div>
  );
};

export default LanguageSelector;