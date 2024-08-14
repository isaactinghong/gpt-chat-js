/*
GET https://www.googleapis.com/customsearch/v1?key=INSERT_YOUR_API_KEY&cx=INSERT_YOUR_CX_KEY&q=YOUR_QUERY

*/
import { z } from "zod";
import { zodFunction } from "openai/helpers/zod";

/*
  zod example:
  const OrderParameters = z.object({
    order_id: z.string().describe("The customer's order ID."),
  });
  const GetDeliveryDateFunction = zodFunction({ name: "getDeliveryDate", parameters: OrderParameters });
*/

export default class GoogleSearchAPI {
  static _apiKey: string;
  static _cx: string;

  static _searchUrl = "https://www.googleapis.com/customsearch/v1";

  constructor() {}

  static setApiKey(apiKey: string) {
    this._apiKey = apiKey;
  }

  static setCX(cx: string) {
    this._cx = cx;
  }

  static searchGoogle({
    query,
  }: {
    query: string;
  }): Promise<{ status: string; totalResults: number; articles: any[] }> {
    const urlSearchParams = new URLSearchParams();

    urlSearchParams.append("q", query);

    urlSearchParams.append("key", this._apiKey);
    urlSearchParams.append("cx", this._cx);

    return fetch(`${this._searchUrl}?${urlSearchParams.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }

  static searchGoogleParameter = z.object({
    query: z.string().describe("The query to search for in Google."),
  });
  static searchGoogleFunctionName = "search_google";
  static searchGoogleFunction = zodFunction({
    name: GoogleSearchAPI.searchGoogleFunctionName,
    parameters: GoogleSearchAPI.searchGoogleParameter,
  });
}
