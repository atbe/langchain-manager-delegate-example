import { SerpAPI, Tool } from "langchain/tools";

export class SportsNewsTool extends Tool {
  name: string = "Sports News";
  description: string =
    "This tool fetches the latest sports news from the web.";

  private readonly serpTool: SerpAPI;

  constructor(serpTool: SerpAPI) {
    super();
    this.serpTool = serpTool;
  }

  protected _call(zipCode: string): Promise<string> {
    return this.serpTool.call(
      `What is the latest sports news for the zip code ${zipCode}?`
    );
  }
}
