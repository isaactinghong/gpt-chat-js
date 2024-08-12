/*

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

export interface Article {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}
