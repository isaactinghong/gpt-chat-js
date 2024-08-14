/*
GET https://www.googleapis.com/customsearch/v1?key=INSERT_YOUR_API_KEY&cx=INSERT_YOUR_CX_KEY&q=YOUR_QUERY

Query parameters
Parameters
c2coff
string

Enables or disables Simplified and Traditional Chinese Search.

The default value for this parameter is 0 (zero), meaning that the feature is enabled. Supported values are:

1: Disabled

0: Enabled (default)

cr
string

Restricts search results to documents originating in a particular country. You may use Boolean operators in the cr parameter's value.

Google Search determines the country of a document by analyzing:

the top-level domain (TLD) of the document's URL

the geographic location of the Web server's IP address

See the Country Parameter Values page for a list of valid values for this parameter.

cx
string

The Programmable Search Engine ID to use for this request.

dateRestrict
string

Restricts results to URLs based on date. Supported values include:

d[number]: requests results from the specified number of past days.

w[number]: requests results from the specified number of past weeks.

m[number]: requests results from the specified number of past months.

y[number]: requests results from the specified number of past years.

exactTerms
string

Identifies a phrase that all documents in the search results must contain.

excludeTerms
string

Identifies a word or phrase that should not appear in any documents in the search results.

fileType
string

Restricts results to files of a specified extension. A list of file types indexable by Google can be found in Search Console Help Center.

filter
string

Controls turning on or off the duplicate content filter.

See Automatic Filtering for more information about Google's search results filters. Note that host crowding filtering applies only to multi-site searches.

By default, Google applies filtering to all search results to improve the quality of those results.

Acceptable values are:

0: Turns off duplicate content filter.

1: Turns on duplicate content filter.

gl
string

Geolocation of end user.

The gl parameter value is a two-letter country code. The gl parameter boosts search results whose country of origin matches the parameter value. See the Country Codes page for a list of valid values.

Specifying a gl parameter value should lead to more relevant results. This is particularly true for international customers and, even more specifically, for customers in English- speaking countries other than the United States.

googlehost
string

Deprecated. Use the gl parameter for a similar effect.

The local Google domain (for example, google.com, google.de, or google.fr) to use to perform the search.

highRange
string

Specifies the ending value for a search range.

Use lowRange and highRange to append an inclusive search range of lowRange...highRange to the query.
hl
string

Sets the user interface language.

Explicitly setting this parameter improves the performance and the quality of your search results.

See the Interface Languages section of Internationalizing Queries and Results Presentation for more information, and Supported Interface Languages for a list of supported languages.

hq
string

Appends the specified query terms to the query, as if they were combined with a logical AND operator.

imgColorType
enum (ImgColorType)

Returns black and white, grayscale, transparent, or color images. Acceptable values are:

"color"

"gray"

"mono": black and white

"trans": transparent background

imgDominantColor
enum (ImgDominantColor)

Returns images of a specific dominant color. Acceptable values are:

"black"

"blue"

"brown"

"gray"

"green"

"orange"

"pink"

"purple"

"red"

"teal"

"white"

"yellow"

imgSize
enum (ImgSize)

Returns images of a specified size. Acceptable values are:

"huge"

"icon"

"large"

"medium"

"small"

"xlarge"

"xxlarge"

imgType
enum (ImgType)

Returns images of a type. Acceptable values are:

"clipart"

"face"

"lineart"

"stock"

"photo"

"animated"

linkSite
string

Specifies that all search results should contain a link to a particular URL.

lowRange
string

Specifies the starting value for a search range. Use lowRange and highRange to append an inclusive search range of lowRange...highRange to the query.

lr
string

Restricts the search to documents written in a particular language (e.g., lr=lang_ja).

Acceptable values are:

"lang_ar": Arabic

"lang_bg": Bulgarian

"lang_ca": Catalan

"lang_cs": Czech

"lang_da": Danish

"lang_de": German

"lang_el": Greek

"lang_en": English

"lang_es": Spanish

"lang_et": Estonian

"lang_fi": Finnish

"lang_fr": French

"lang_hr": Croatian

"lang_hu": Hungarian

"lang_id": Indonesian

"lang_is": Icelandic

"lang_it": Italian

"lang_iw": Hebrew

"lang_ja": Japanese

"lang_ko": Korean

"lang_lt": Lithuanian

"lang_lv": Latvian

"lang_nl": Dutch

"lang_no": Norwegian

"lang_pl": Polish

"lang_pt": Portuguese

"lang_ro": Romanian

"lang_ru": Russian

"lang_sk": Slovak

"lang_sl": Slovenian

"lang_sr": Serbian

"lang_sv": Swedish

"lang_tr": Turkish

"lang_zh-CN": Chinese (Simplified)

"lang_zh-TW": Chinese (Traditional)

num
integer

Number of search results to return.

Valid values are integers between 1 and 10, inclusive.
orTerms
string

Provides additional search terms to check for in a document, where each document in the search results must contain at least one of the additional search terms.

q
string

Query

relatedSite
(deprecated)
string

Deprecated.

rights
string

Filters based on licensing. Supported values include: cc_publicdomain, cc_attribute, cc_sharealike, cc_noncommercial, cc_nonderived and combinations of these. See typical combinations.

safe
enum (Safe)

Search safety level. Acceptable values are:

"active": Enables SafeSearch filtering.

"off": Disables SafeSearch filtering. (default)

searchType
enum (SearchType)

Specifies the search type: image. If unspecified, results are limited to webpages.

Acceptable values are:

"image": custom image search.
siteSearch
string

Specifies a given site which should always be included or excluded from results (see siteSearchFilter parameter, below).

siteSearchFilter
enum (SiteSearchFilter)

Controls whether to include or exclude results from the site named in the siteSearch parameter.

Acceptable values are:

"e": exclude

"i": include

sort
string

The sort expression to apply to the results. The sort parameter specifies that the results be sorted according to the specified expression i.e. sort by date. Example: sort=date.

start
integer (uint32 format)

The index of the first result to return. The default number of results per page is 10, so &start=11 would start at the top of the second page of results. Note: The JSON API will never return more than 100 results, even if more than 100 documents match the query, so setting the sum of start + num to a number greater than 100 will produce an error. Also note that the maximum value for num is 10.


Google can index the content of most text-based files and certain encoded document formats. The most common file types we index include:

Adobe Portable Document Format (.pdf)
Adobe PostScript (.ps)
Comma-Separated Values (.csv)
Electronic Publication (.epub)
Google Earth (.kml, .kmz)
GPS eXchange Format (.gpx)
Hancom Hanword (.hwp)
HTML (.htm, .html, other file extensions)
Microsoft Excel (.xls, .xlsx)
Microsoft PowerPoint (.ppt, .pptx)
Microsoft Word (.doc, .docx)
OpenOffice presentation (.odp)
OpenOffice spreadsheet (.ods)
OpenOffice text (.odt)
Rich Text Format (.rtf)
Scalable Vector Graphics (.svg)
TeX/LaTeX (.tex)
Text (.txt, .text, other file extensions), including source code in common programming languages, such as:
Basic source code (.bas)
C/C++ source code (.c, .cc, .cpp, .cxx, .h, .hpp)
C# source code (.cs)
Java source code (.java)
Perl source code (.pl)
Python source code (.py)
Wireless Markup Language (.wml, .wap)
XML (.xml)
Google can also index the following media formats:

Image formats: BMP, GIF, JPEG, PNG, WebP, and SVG
Video formats: 3GP, 3G2, ASF, AVI, DivX, M2V, M3U, M3U8, M4V, MKV, MOV, MP4, MPEG, OGV, QVT, RAM, RM, VOB, WebM, WMV, and XAP
*/
import { z } from "zod";
import { zodFunction } from "openai/helpers/zod";

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
    params,
  }: {
    params: any;
  }): Promise<{ status: string; totalResults: number; articles: any[] }> {
    const urlSearchParams = new URLSearchParams();

    // for each key of the params object, add it to the URLSearchParams
    for (const key in params) {
      if (params[key] !== undefined) {
        // check if "none" is passed as a value, if so, don't add it to the URLSearchParams
        if (params[key] === "none") {
          continue;
        }

        urlSearchParams.append(key, params[key]);
      }
    }

    urlSearchParams.append("key", this._apiKey);
    urlSearchParams.append("cx", this._cx);

    return fetch(`${this._searchUrl}?${urlSearchParams.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }

  static searchGoogleParameter = z.object({
    // dateRestrict: z
    //   .string()
    //   .optional()
    //   .describe(
    //     "Restricts results to URLs based on date. Supported values include: d[number]: requests results from the specified number of past days. w[number]: requests results from the specified number of past weeks. m[number]: requests results from the specified number of past months. y[number]: requests results from the specified number of past years.",
    //   ),
    // exactTerms: z
    //   .string()
    //   .optional()
    //   .describe(
    //     "Identifies a phrase that all documents in the search results must contain.",
    //   ),
    // excludeTerms: z
    //   .string()
    //   .optional()
    //   .describe(
    //     "Identifies a word or phrase that should not appear in any documents in the search results.",
    //   ),
    // fileType: z
    //   .enum([
    //     "pdf",
    //     "ps",
    //     "csv",
    //     "epub",
    //     "kml",
    //     "kmz",
    //     "gpx",
    //     "hwp",
    //     "html",
    //     "xls",
    //     "xlsx",
    //     "ppt",
    //     "pptx",
    //     "doc",
    //     "docx",
    //     "odp",
    //     "ods",
    //     "odt",
    //     "rtf",
    //     "svg",
    //     "tex",
    //     "txt",
    //     "bas",
    //     "c",
    //     "cc",
    //     "cpp",
    //     "cxx",
    //     "h",
    //     "hpp",
    //     "cs",
    //     "java",
    //     "pl",
    //     "py",
    //     "wml",
    //     "xml",
    //     "bmp",
    //     "gif",
    //     "jpeg",
    //     "png",
    //     "webp",
    //     "svg",
    //     "3gp",
    //     "3g2",
    //     "asf",
    //     "avi",
    //     "divx",
    //     "m2v",
    //     "m3u",
    //     "m3u8",
    //     "m4v",
    //     "mkv",
    //     "mov",
    //     "mp4",
    //     "mpeg",
    //     "ogv",
    //     "qvt",
    //     "ram",
    //     "rm",
    //     "vob",
    //     "webm",
    //     "wmv",
    //     "xap",
    //   ])
    //   .optional()
    //   .describe("Restricts results to files of a specified extension."),
    // gl: z
    //   .string()
    //   .optional()
    //   .describe(
    //     "Geolocation of end user. The gl parameter value is a two-letter country code.",
    //   ),
    // highRange: z
    //   .string()
    //   .optional()
    //   .describe("Specifies the ending value for a search range."),
    // hl: z
    //   .string()
    //   .optional()
    //   .describe("Sets the user interface language. e.g. en, zh-CN, zh-TW"),
    // hq: z
    //   .string()
    //   .optional()
    //   .describe(
    //     "Appends the specified query terms to the query, as if they were combined with a logical AND operator.",
    //   ),
    imgColorType: z
      .enum(["color", "gray", "mono", "trans", "none"])
      .optional()
      .describe(
        "Returns black and white, grayscale, transparent, or color images.",
      ),
    imgDominantColor: z
      .enum([
        "black",
        "blue",
        "brown",
        "gray",
        "green",
        "orange",
        "pink",
        "purple",
        "red",
        "teal",
        "white",
        "yellow",
        "none",
      ])
      .optional()
      .describe(
        "Returns images of a specific dominant color. do not specify if you want all colors.",
      ),
    imgSize: z
      .enum([
        "huge",
        "icon",
        "large",
        "medium",
        "small",
        "xlarge",
        "xxlarge",
        "none",
      ])
      .optional()
      .describe("Returns images of a specified size."),
    imgType: z
      .enum([
        "clipart",
        "face",
        "lineart",
        "stock",
        "photo",
        "animated",
        "none",
      ])
      .optional()
      .describe("Returns images of a type."),
    // lowRange: z
    //   .string()
    //   .optional()
    //   .describe("Specifies the starting value for a search range."),
    num: z
      .number()
      .int()
      .optional()
      .describe("Number of search results to return."),
    // orTerms: z
    //   .string()
    //   .optional()
    //   .describe(
    //     "Provides additional search terms to check for in a document, where each document in the search results must contain at least one of the additional search terms.",
    //   ),
    q: z.string().describe("The query"),
    searchType: z
      .enum(["image", "none"])
      .optional()
      .describe(
        "Specifies the search type: image. If unspecified, results are limited to webpages.",
      ),
    // siteSearch: z
    //   .string()
    //   .optional()
    //   .describe(
    //     "Specifies a given site which should always be included or excluded from results.",
    //   ),
    // siteSearchFilter: z
    //   .enum(["e", "i"])
    //   .optional()
    //   .describe(
    //     "Controls whether to include or exclude results from the site named in the siteSearch parameter.",
    //   ),
    // sort: z
    //   .string()
    //   .optional()
    //   .describe(
    //     "The sort expression to apply to the results. The sort parameter specifies that the results be sorted according to the specified expression i.e. sort by date. Example: sort=date.",
    //   ),
    start: z
      .number()
      .int()
      .optional()
      .describe(
        "The index of the first result to return. The default number of results per page is 10.",
      ),
  });
  static searchGoogleFunctionName = "search_google";
  static searchGoogleFunction = zodFunction({
    name: GoogleSearchAPI.searchGoogleFunctionName,
    parameters: GoogleSearchAPI.searchGoogleParameter,
  });
}
