import { createServer } from 'node:http';

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

// Wire-level check against a local OpenAI-compatible mock.
let seenAuth = '';
let seenModel = '';
const server = createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    if (req.url !== '/v1/chat/completions') {
      res.writeHead(404);
      res.end(JSON.stringify({ error: { message: 'not found' } }));
      return;
    }
    seenAuth = req.headers.authorization ?? '';
    seenModel = JSON.parse(body).model;
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify({
        id: 'chatcmpl-mock',
        object: 'chat.completion',
        created: 1,
        model: seenModel,
        choices: [{ index: 0, message: { role: 'assistant', content: 'hello from mock' }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 1, completion_tokens: 3, total_tokens: 4 },
      })
    );
  });
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const wire = new ChatCrowLLM({
  apiKey: 'test-key',
  configuration: { baseURL: `http://127.0.0.1:${port}/v1` },
});
const reply = await wire.invoke('hi');
server.close();

if (reply.content !== 'hello from mock') throw new Error('unexpected mock reply: ' + reply.content);
if (seenAuth !== 'Bearer test-key') throw new Error('unexpected Authorization header: ' + seenAuth);
if (seenModel !== 'deepseek-v4-flash') throw new Error('unexpected wire model: ' + seenModel);

console.log('ok', CROWLLM_BASE_URL, llm.model, '| wire:', seenAuth, seenModel);
