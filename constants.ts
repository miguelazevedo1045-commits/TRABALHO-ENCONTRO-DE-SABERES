
import { Language, Topic, LanguageOption } from './types';

export const LANGUAGES: LanguageOption[] = [
  { id: Language.English, name: 'Inglês', flag: 'IN' },
  { id: Language.Spanish, name: 'Espanhol', flag: 'ES' },
  { id: Language.French, name: 'Francês', flag: 'FR' },
  { id: Language.German, name: 'Alemão', flag: 'AL' },
  { id: Language.Portuguese, name: 'Português', flag: 'BR' },
];

export const TOPICS: { id: Topic; name: string; icon: string }[] = [
  { id: Topic.Grammar, name: 'Gramática', icon: '📖' },
  { id: Topic.Writing, name: 'Escrita', icon: '✍️' },
];
