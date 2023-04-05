/**
 *
 * TODO:
 *
 * 1. Setup the main chain with the directive of:
 * 		- 1.1. Taking in the input of a zip code
 * 		- 1.2. Passing the request off to the 3 ChainTool classes
 * 		- 1.3. Returning the response from the 3 ChainTool classes
 * 2. Run the chain to answer the questions
 */

import { ChainTool, SerpAPI } from "langchain/tools";

import { LLMSingleActionAgent } from "langchain/agents";

import { LocalInfoChain } from "./chains/LocalInfoChain.js";

import { config } from "dotenv";
import { BaseChain, LLMChain } from "langchain/chains";
import { CustomOutputParser, CustomPromptTemplate } from "./agents/Weather.js";
import { OpenAI } from "langchain/llms";

config({
  path: ".env.local",
});

const run = async () => {
  process.env.LANGCHAIN_HANDLER = "langchain";

  const model = new OpenAI(
    { temperature: 0 },
    {
      apiKey: process.env.OPENAI_API_KEY,
    }
  );

  const weatherManLlmChain = new LLMChain({
    prompt: new CustomPromptTemplate({
      tools: [new SerpAPI()],
      inputVariables: ["input", "agent_scratchpad"],
    }),
    llm: model,
  });
  const weatherAgent = new LLMSingleActionAgent({
    llmChain: weatherManLlmChain,
    outputParser: new CustomOutputParser(),
    stop: ["\nObservation"],
  });

  const tools = [
    new SerpAPI(),
    new ChainTool({
      chain: weatherAgent as unknown as BaseChain,
      description:
        "This agent can be used to lookup the weather for particular location.",
      name: "Weather Agent",
    }),
  ];

  const llmChain = new LLMChain({
    prompt: new CustomPromptTemplate({
      tools,
      inputVariables: ["input", "agent_scratchpad"],
    }),
    llm: model,
  });

  const response = await llmChain.call({
    input: "What is the weather for 94123?",
  });

  console.log("Response", response);
};

run()
  .then(() => console.log("Done"))
  .catch((error) => {
    console.error(error);

    process.exit(1);
  });
