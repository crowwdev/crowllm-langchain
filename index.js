import { ChatOpenAI } from '@langchain/openai';

export const CROWLLM_BASE_URL = 'https://crowllm.com/v1';
export const CROWLLM_DEFAULT_MODEL = 'deepseek-v4-flash';

/**
 * CrowLLM chat model for LangChain.js.
 *
 * CrowLLM is an OpenAI-compatible gateway: one endpoint and one key for every
 * model, with a mostly zero-rated `:free` shelf next to the paid ids. The
 * catalog is public at https://crowllm.com/v1/models.
 */
export class ChatCrowLLM extends ChatOpenAI {
  static lc_name() {
    return 'ChatCrowLLM';
  }

  constructor(fields = {}) {
    const apiKey = fields.apiKey ?? process.env.CROWLLM_API_KEY;
    if (!apiKey) {
      throw new Error('CrowLLM API key is required: pass { apiKey } or set CROWLLM_API_KEY');
    }

    super({
      model: fields.model ?? CROWLLM_DEFAULT_MODEL,
      ...fields,
      apiKey,
      configuration: {
        baseURL: CROWLLM_BASE_URL,
        ...(fields.configuration ?? {}),
      },
    });
  }
}

export default ChatCrowLLM;
