# langchain-crowllm

[CrowLLM](https://crowllm.com) chat model for [LangChain.js](https://js.langchain.com).

CrowLLM is an OpenAI-compatible gateway: one endpoint (`https://crowllm.com/v1`), one key, and every model behind it — including a mostly zero-rated `:free` shelf. The catalog is public and keyless at <https://crowllm.com/v1/models>.

## Install

```bash
npm install langchain-crowllm @langchain/core @langchain/openai
```

Until the npm release is out, install the tagged build straight from GitHub:

```bash
npm install github:crowwdev/crowllm-langchain#v0.1.0 @langchain/core @langchain/openai
```

## Usage

```js
import { ChatCrowLLM } from 'langchain-crowllm';

const llm = new ChatCrowLLM({
  apiKey: process.env.CROWLLM_API_KEY, // optional: read from CROWLLM_API_KEY
  model: 'deepseek-v4-flash',          // any id from /v1/models
});

const reply = await llm.invoke('Write a haiku about a crow.');
console.log(reply.content);
```

Any model id from the gateway works, for example `claude-opus-5-5`, `glm-5.3` or `qwen-3.8-27b:free`. Prices live at <https://crowllm.com/api/pricing>.

`ChatCrowLLM` extends `ChatOpenAI`, so streaming, tool calling, structured output and the rest of LangChain's chat features work the same way.

## Overrides

```js
const llm = new ChatCrowLLM({
  model: 'gpt-6-astra',
  temperature: 0.2,
  configuration: { baseURL: 'https://crowllm.com/v1' }, // default
});
```

## License

MIT
