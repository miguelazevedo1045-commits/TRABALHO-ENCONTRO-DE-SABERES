
import { Language, Topic, LanguageOption } from './types';

export const LANGUAGES: LanguageOption[] = [
  { id: Language.English, name: 'Inglês', flag: '🇺🇸' },
  { id: Language.Spanish, name: 'Espanhol', flag: '🇪🇸' },
  { id: Language.French, name: 'Francês', flag: '🇫🇷' },
  { id: Language.German, name: 'Alemão', flag: '🇩🇪' },
  { id: Language.Portuguese, name: 'Português', flag: '🇧🇷' },
];

export const TOPICS: { id: Topic; name: string; icon: string }[] = [
  { id: Topic.Grammar, name: 'Gramática', icon: '📖' },
  { id: Topic.Writing, name: 'Escrita', icon: '✍️' },
  { id: Topic.Chat, name: 'Conversação', icon: '💬' },
];