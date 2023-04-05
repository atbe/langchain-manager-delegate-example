import { AgentActionOutputParser } from "langchain/agents";
import {
  BasePromptTemplate,
  BaseStringPromptTemplate,
  SerializedBasePromptTemplate,
} from "langchain/prompts";

import {
  AgentAction,
  AgentFinish,
  InputValues,
  PartialValues,
} from "langchain/schema";

import { Tool } from "langchain/tools";

const PREFIX = `Generate a list of the latest sports news for a particular area by zip code. You have access to the following tools:`;

export class LocalInfoChain extends BaseStringPromptTemplate {
  tools: Tool[];

  constructor(args: { tools: Tool[]; inputVariables: string[] }) {
    super({ inputVariables: args.inputVariables });
    this.tools = args.tools;
  }

  partial(values: PartialValues): Promise<BasePromptTemplate> {
    throw new Error("Method not implemented.");
  }
  format(values: InputValues): Promise<string> {
    throw new Error("Method not implemented.");
  }
  _getPromptType(): string {
    throw new Error("Method not implemented.");
  }
  serialize(): SerializedBasePromptTemplate {
    throw new Error("Method not implemented.");
  }
}

export class CustomOutputParser extends AgentActionOutputParser {
  async parse(text: string): Promise<AgentAction | AgentFinish> {
    if (text.includes("Final Answer:")) {
      const parts = text.split("Final Answer:");
      const input = parts[parts.length - 1].trim();
      const finalAnswers = { output: input };
      return { log: text, returnValues: finalAnswers };
    }

    const match = /Action: (.*)\nAction Input: (.*)/s.exec(text);
    if (!match) {
      throw new Error(`Could not parse LLM output: ${text}`);
    }

    return {
      tool: match[1].trim(),
      toolInput: match[2].trim().replace(/^"+|"+$/g, ""),
      log: text,
    };
  }

  getFormatInstructions(): string {
    throw new Error("Not implemented");
  }
}
