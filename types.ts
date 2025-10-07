
export enum Language {
  English = 'Inglês',
  Spanish = 'Espanhol',
  French = 'Francês',
  German = 'Alemão',
  Portuguese = 'Português',
}

export enum Topic {
  Grammar = 'Gramática',
  Writing = 'Escrita',
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface LanguageOption {
  id: Language;
  name: string;
  flag: string;
}
