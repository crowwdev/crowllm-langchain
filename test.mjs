import { ChatCrowLLM, CROWLLM_BASE_URL, CROWLLM_DEFAULT_MODEL } from './index.js';

const llm = new ChatCrowLLM({ apiKey: 'test-key' });

if (CROWLLM_BASE_URL !== 'https://crowllm.com/v1') throw new Error('unexpected base URL constant');
if (CROWLLM_DEFAULT_MODEL !== 'deepseek-v4-flash') throw new Error('unexpected default model');
if (llm.model !== 'deepseek-v4-flash') throw new Error(`unexpected model: ${llm.model}`);

const custom = new ChatCrowLLM({ apiKey: 'test-key', model: 'glm-5.3', temperature: 0.2 });
if (custom.model !== 'glm-5.3') throw new Error(`model override lost: ${custom.model}`);

const customBase = new ChatCrowLLM({
  apiKey: 'test-key',
  configuration: { baseURL: 'https://example.test/v1' },
});
if (customBase.clientConfig?.baseURL !== 'https://example.test/v1') {
  throw new Error(`base URL override lost: ${customBase.clientConfig?.baseURL}`);
}

process.env.CROWLLM_API_KEY = 'env-key';
const fromEnv = new ChatCrowLLM();
if (fromEnv.model !== 'deepseek-v4-flash') throw new Error('env-key construction failed');

console.log('ok', CROWLLM_BASE_URL, llm.model);
