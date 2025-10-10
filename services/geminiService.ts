
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Language, Topic, QuizQuestion } from '../types';

// FIX: Updated API key handling to align with @google/genai guidelines.
// The API key must be obtained from `process.env.API_KEY` and is assumed to be
// configured in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizQuestionSchema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: 'A pergunta do quiz no idioma selecionado.'
    },
    options: {
      type: Type.ARRAY,
      description: 'Uma lista de 4 possíveis respostas.',
      items: { type: Type.STRING }
    },
    correctAnswer: {
      type: Type.STRING,
      description: 'A resposta exata e correta da lista de opções.'
    },
    explanation: {
      type: Type.STRING,
      description: 'Uma breve explicação em português sobre por que a resposta está correta, para ser exibida se o usuário errar.'
    }
  },
  required: ['question', 'options', 'correctAnswer', 'explanation']
};

export async function generateQuizQuestion(language: Language, topic: Topic): Promise<QuizQuestion> {
  try {
    const prompt = `Gere uma única pergunta de múltipla escolha para um estudante de ${language} de nível intermediário, focando no tópico de ${topic}. A pergunta e as opções devem estar em ${language}. A explicação deve estar em português. Garanta que a "correctAnswer" corresponda exatamente a um dos itens em "options".`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizQuestionSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    // Basic validation
    if (!parsedJson.question || !Array.isArray(parsedJson.options) || parsedJson.options.length !== 4 || !parsedJson.correctAnswer || !parsedJson.explanation) {
        throw new Error("Formato de resposta da IA inválido");
    }

    if (!parsedJson.options.includes(parsedJson.correctAnswer)) {
        throw new Error("A resposta correta não está presente nas opções.");
    }
    
    return parsedJson as QuizQuestion;

  } catch (error) {
    console.error("Erro ao gerar pergunta do quiz:", error);
    throw new Error("Não foi possível gerar uma nova pergunta. Tente novamente.");
  }
}

export function createChatSession(language: Language): Chat {
  const systemInstruction = `Você é um tutor de ${language} amigável e paciente. Seu objetivo é ter uma conversa natural com um estudante de nível intermediário. Responda sempre em ${language}. Se o estudante cometer um erro de gramática ou usar uma frase que soe pouco natural, primeiro responda à pergunta ou comentário dele de forma útil e natural. Depois, em um novo parágrafo, ofereça uma correção de forma gentil e encorajadora. Por exemplo: "A propósito, uma forma mais comum de dizer isso seria: '[frase corrigida]'. Mas seu ponto foi perfeitamente claro!". Mantenha suas respostas relativamente curtas para incentivar um diálogo.`;

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.8,
    },
  });
  return chat;
}