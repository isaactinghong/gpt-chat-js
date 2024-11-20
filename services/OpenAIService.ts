import { OpenAI as OpenAIBase } from "openai";

export default class OpenAI {
  private static _instance: OpenAI | null = null;

  private static DEFAULT_BASE_URL: string = "https://walrus-app-zl2gh.ondigitalocean.app/api";

  _openai;

  /**
   * @returns {OpenAI}
   */
  static getInstance(): OpenAI {
    if (OpenAI._instance == null) {
      OpenAI._instance = new OpenAI();
    }

    return OpenAI._instance!;
  }

  static get api(): OpenAIBase {
    return this.getInstance()._openai;
  }

  constructor() {
    // const proxyUrl = process.env.PROXY_URL;
    // const proxyUrl = "https://walrus-app-zl2gh.ondigitalocean.app/api";

    this._openai = new OpenAIBase({
      apiKey: "123",
      // httpAgent: agent,
      baseURL: OpenAI.DEFAULT_BASE_URL,
      dangerouslyAllowBrowser: true,
    });
  }

  static setApiKey(apiKey: string) {
    if (!this.api) {
      return;
    }
    this.api.apiKey = apiKey;
  }

  static setBaseUrl(baseUrl: string) {
    if (!this.api) {
      return;
    }
    if (!baseUrl) {
      // log warn
      console.warn("Base URL is not valid. Using default base URL.");
      baseUrl = OpenAI.DEFAULT_BASE_URL;
    }
    this.api.baseURL = baseUrl;
  }

  static async suggestFileName(text: string) {
    return await this.api.chat.completions
      .create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `give a file name (without file extension) for this audio file with this voice over:\n${text}`,
          },
        ],
      })
      .then((response) => {
        return response.choices[0].message.content;
      });
  }
}
