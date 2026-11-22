import type { ChatOpenAI, ChatOpenAIFields } from '@langchain/openai';

export declare const CROWLLM_BASE_URL: 'https://crowllm.com/v1';
export declare const CROWLLM_DEFAULT_MODEL: 'deepseek-v4-flash';

export interface ChatCrowLLMFields extends Partial<ChatOpenAIFields> {
  /** CrowLLM API key. Defaults to process.env.CROWLLM_API_KEY. */
  apiKey?: string;
}

/**
 * CrowLLM chat model for LangChain.js.
 *
 * Defaults to `https://crowllm.com/v1` and `deepseek-v4-flash`; any model id
 * from the public catalog works, e.g. `claude-opus-5-5` or `glm-5.3:free`.
 */
export declare class ChatCrowLLM extends ChatOpenAI {
  static lc_name(): 'ChatCrowLLM';
  constructor(fields?: ChatCrowLLMFields);
}

export default ChatCrowLLM;
