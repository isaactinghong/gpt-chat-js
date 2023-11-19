import { OpenAI as OpenAIBase } from "openai";

export default class OpenAI {
  private static _instance = null;

  _openai;

  /**
   * @returns {OpenAI}
   */
  static getInstance(): OpenAI {
    if (OpenAI._instance == null) {
      OpenAI._instance = new OpenAI();
    }

    return this._instance;
  }

  static get api(): OpenAIBase {
    return this.getInstance()._openai;
  }

  constructor() {
    const proxyUrl = "https://walrus-app-zl2gh.ondigitalocean.app/api";
    console.log("proxyUrl", proxyUrl);

    this._openai = new OpenAIBase({
      apiKey: "123",
      // httpAgent: agent,
      baseURL: proxyUrl,
      dangerouslyAllowBrowser: true,
    });
  }

  static setApiKey(apiKey) {
    if (!this.api) {
      return;
    }
    this.api.apiKey = apiKey;
  }
}
