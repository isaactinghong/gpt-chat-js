
import { z } from "zod";
import { zodFunction } from "openai/helpers/zod";

export default class CrawlAPI {

  static _crawlUrl = "https://walrus-app-zl2gh.ondigitalocean.app/crawl";

  constructor() {}

  static crawlWebsite({
    url,
  }: {
    url: string;
  }): Promise<{ status: string; totalResults: number; articles: any[] }> {
    const urlSearchParams = new URLSearchParams();

    urlSearchParams.append("url", url);

    return fetch(`${this._crawlUrl}?${urlSearchParams.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }

  static crawlWebsiteParameter = z.object({
    url: z.string().describe("The URL of the website to crawl"),
  });
  static crawlWebsiteFunctionName = "crawl_website";
  static crawlWebsiteFunction = zodFunction({
    name: CrawlAPI.crawlWebsiteFunctionName,
    parameters: CrawlAPI.crawlWebsiteParameter,
  });
}
