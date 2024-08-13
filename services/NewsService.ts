import { Article } from "../models/article";
import { z } from "zod";
import { zodFunction } from "openai/helpers/zod";

/*
  zod example:
  const OrderParameters = z.object({
    order_id: z.string().describe("The customer's order ID."),
  });
  const GetDeliveryDateFunction = zodFunction({ name: "getDeliveryDate", parameters: OrderParameters });
*/

export default class NewsAPI {
  static _apiKey: string;

  static _proxyUrl = "https://walrus-app-zl2gh.ondigitalocean.app/news/";

  constructor() {}

  static setApiKey(apiKey: string) {
    this._apiKey = apiKey;
  }

  // Search for news articles that mention a specific topic or keyword
  /*
  var url = 'https://newsapi.org/v2/everything?' +
          'q=Apple&' +
          'from=2024-08-12&' +
          'sortBy=popularity&' +
          'apiKey=e579c976488d4bc089db85af9f863766';

var req = new Request(url);

fetch(req)
    .then(function(response) {
        console.log(response.json());
    })
Example response
{
"status": "ok",
"totalResults": 555,
-"articles": [
-{
-"source": {
"id": "wired",
"name": "Wired"
},
"author": "Michael Calore",
"title": "How to Watch the Made by Google Pixel 9 Launch Event, and What to Expect",
"description": "At its media event Tuesday, Google will unveil four new flagship Pixel handsets, new Pixel Watches, and new Pixel Buds. We can also expect a whole lot of Gemini. Here’s how to tune in.",
"url": "https://www.wired.com/story/made-by-google-2024-pixel-9-launch-event-how-to-watch-what-to-expect/",
"urlToImage": "",
"publishedAt": "2024-08-12T09:00:00Z",
"content": "Reporters from WIRED will be attending the event in person, and we'll be running a liveblog on Tuesday to provide insight around Google's announcements has they happen.\r\nWe're going to see a lot of h… [+3389 chars]"
},
*/
  static searchArticlesOfTopic({
    topicOrKeyword,
    from,
    sortBy,
  }: {
    topicOrKeyword: string;
    from?: string;
    sortBy?: string;
  }): Promise<{ status: string; totalResults: number; articles: Article[] }> {
    const urlSearchParams = new URLSearchParams();

    urlSearchParams.append("q", topicOrKeyword);

    if (from) {
      urlSearchParams.append("from", from);
    }
    if (sortBy) {
      urlSearchParams.append("sortBy", sortBy);
    }

    urlSearchParams.append("apiKey", this._apiKey);

    return fetch(
      `${this._proxyUrl}/v2/everything?${urlSearchParams.toString()}`,
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }

  // description of the function `searchArticlesOfTopic` to OpenAI:
  // static descriptionSearchArticlesOfTopic = {
  //   name: "search_articles_of_topic",
  //   description:
  //     "Search for news articles that mention a specific topic or keyword",
  //   parameters: {
  //     type: "object",
  //     properties: {
  //       topic_or_keyword: {
  //         type: "string",
  //         description:
  //           "The topic or keyword to search for in the news articles.",
  //       },
  //       from: {
  //         type: "string",
  //         description:
  //           "The date from which to search for news articles. Format: YYYY-MM-DD",
  //       },
  //       sortBy: {
  //         type: "string",
  //         description:
  //           "The sorting method for the search results. Possible values: relevancy, popularity, publishedAt",
  //       },
  //     },
  //     required: ["topic_or_keyword"],
  //     additionalProperties: false,
  //   },
  // };

  static searchArticlesOfTopicParameter = z.object({
    topicOrKeyword: z
      .string()
      .describe("The topic or keyword to search for in the news articles."),
    from: z
      .string()
      .optional()
      .describe(
        "The date from which to search for news articles. Format: YYYY-MM-DD",
      ),
    sortBy: z
      .string()
      .optional()
      .describe(
        "The sorting method for the search results. Possible values: relevancy, popularity, publishedAt",
      ),
  });
  static searchArticlesOfTopicFunction = zodFunction({
    name: "search_articles_of_topic",
    parameters: NewsAPI.searchArticlesOfTopicParameter,
  });

  // Get the current top headlines for a country or category
  /*
country
The 2-letter ISO 3166-1 code of the country you want to get headlines for.
Possible options: ae,ar,at,au,be,bg,br,ca,ch,cn,co,cu,de,eg,fr,gb,gr,hk,hu,id,ie,il,in,jp,kr,lt,lv,ma,mx,my,ng,no,ph,pl,pt,ro,rs,ru,sg,sk,th,tr,ua,us,ve,za
Note: you can't mix this param with the sources param.

category
The category you want to get headlines for. Possible options: business, entertainment, general, health, science, sports, technology.
Note: you can't mix this param with the sources param.

q
Keywords or a phrase to search for.

GET https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=API_KEY
Example request
var url = 'https://newsapi.org/v2/top-headlines?' +
          'sources=bbc-news&' +
          'apiKey=e579c976488d4bc089db85af9f863766';
var req = new Request(url);
fetch(req)
    .then(function(response) {
        console.log(response.json());
    })
Example response
{
"status": "ok",
"totalResults": 10,
-"articles": [
-{
-"source": {
"id": "bbc-news",
"name": "BBC News"
},
"author": "BBC News",
"title": "Raw-dogging on planes: Heroic or just plain stupid?",
"description": "Some fliers are giving up in-flight entertainment and even drinking water but experts warn it could be dangerous.",
"url": "https://www.bbc.co.uk/news/articles/c5y83kj3wg2o",
"urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_news/1d97/live/4105cc40-57b9-11ef-aebc-6de4d31bf5cd.jpg",
"publishedAt": "2024-08-12T12:07:23.1799417Z",
"content": "Last week, Damion Bailey posted on Instagram that he had just achieved his personal best a 13-and-a-half hour flight between Shanghai and Dallas without any in-flight entertainment, films, books or m… [+1072 chars]"
},

*/
  static getTopHeadlines({
    country,
    category,
    q,
  }: {
    country?: string;
    category?: string;
    q?: string;
  }): Promise<{ status: string; totalResults: number; articles: any[] }> {
    const urlSearchParams = new URLSearchParams();

    if (country) {
      urlSearchParams.append("country", country);
    }
    if (category) {
      urlSearchParams.append("category", category);
    }
    if (q) {
      urlSearchParams.append("q", q);
    }

    urlSearchParams.append("apiKey", this._apiKey);

    return fetch(
      `${this._proxyUrl}/v2/top-headlines?${urlSearchParams.toString()}`,
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }

  static getTopHeadlinesParameter = z.object({
    country: z
      .string()
      .optional()
      .describe(
        "The 2-letter ISO 3166-1 code of the country you want to get headlines for. Possible options: ae,ar,at,au,be,bg,br,ca,ch,cn,co,cu,de,eg,fr,gb,gr,hk,hu,id,ie,il,in,jp,kr,lt,lv,ma,mx,my,ng,no,ph,pl,pt,ro,rs,ru,sg,sk,th,tr,ua,us,ve,za",
      ),
    category: z
      .string()
      .optional()
      .describe(
        "The category you want to get headlines for. Possible options: business, entertainment, general, health, science, sports, technology",
      ),
    q: z.string().optional().describe("Keywords or a phrase to search for."),
  });
  static getTopHeadlinesFunction = zodFunction({
    name: "get_top_headlines",
    parameters: NewsAPI.getTopHeadlinesParameter,
  });
}

/*
Example function:
// This is the function that we want the model to be able to call
const getDeliveryDate = async (orderId: string): datetime => {
    const connection = await createConnection({
        host: 'localhost',
        user: 'root',
        // ...
    });
}

Exammple description of the function `getDeliveryDate` to OpenAI:
{
    "name": "get_delivery_date",
    "description": "Get the delivery date for a customer's order. Call this whenever you need to know the delivery date, for example when a customer asks 'Where is my package'",
    "parameters": {
        "type": "object",
        "properties": {
            "order_id": {
                "type": "string",
                "description": "The customer's order ID.",
            },
        },
        "required": ["order_id"],
        "additionalProperties": false,
    }
}
*/
