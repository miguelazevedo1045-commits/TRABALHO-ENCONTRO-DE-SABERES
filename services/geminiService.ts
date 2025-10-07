
import { GoogleGenAI, Type } from "@google/genai";
import { Language, Topic, QuizQuestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

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
