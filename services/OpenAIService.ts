
import { OpenAI as OpenAIBase } from 'openai';

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
    this._openai = new OpenAIBase({

      apiKey: "123",
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