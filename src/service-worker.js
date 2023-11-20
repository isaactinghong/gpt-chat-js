/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

// log that service worker is being installed
console.log("service worker installing");

let HOST = "https://gpt-chat-js.netlify.app";
if (process.env.PUBLIC_URL !== undefined) {
  HOST = process.env.PUBLIC_URL;
}

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== "navigate") {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith("/_")) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  // createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html")
  createHandlerBoundToURL(HOST + "/index.html")
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.endsWith(".png"), // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.
self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "POST" ||
    !event.request.url.endsWith("/receive-share")
  ) {
    // Fetch event is not for a POST request to the receive-share URL, so do nothing special.
    return;
  }

  // Handle POST request to the receive-share URL
  event.respondWith(
    (async () => {
      // Assume some custom logic or data processing happens here before redirecting.

      // Redirect to the home page after handling the share
      return Response.redirect("/", 303);
    })()
  );
});

// self.addEventListener("fetch", (event) => {
//   if (event.request.method !== "POST") return;

//   // Check if this is a share target request
//   if (event.request.url.endsWith("/receive-share")) {
//     event.respondWith(Response.redirect("/"));

//     // event.waitUntil(
//     //   (async function () {
//     //     const formData = await event.request.formData();
//     //     const mediaFiles = formData.getAll("audio");

//     //     // set basic data into window.sessionStorage
//     //     const data = {
//     //       title: formData.get("title"),
//     //       text: formData.get("text"),
//     //     };
//     //     window.sessionStorage.setItem("sharedContent", JSON.stringify(data));

//     //     // Do something with the shared audio files,
//     //     // like storing them using the Cache API, IndexedDB, or sending them to your server
//     //     // put them in cache
//     //     const cache = await caches.open("shared-audios");

//     //     // clear window.sessionStorage sharedAudios
//     //     window.sessionStorage.removeItem("sharedAudios");

//     //     await Promise.all(
//     //       mediaFiles.map(async (file) => {
//     //         const response = await fetch(file);
//     //         await cache.put(file.name, response);

//     //         const sharedAudios = window.sessionStorage.getItem("sharedAudios");

//     //         if (sharedAudios) {
//     //           const sharedAudiosArr = JSON.parse(sharedAudios);
//     //           sharedAudiosArr.push(file.name);
//     //           window.sessionStorage.setItem(
//     //             "sharedAudios",
//     //             JSON.stringify(sharedAudiosArr)
//     //           );
//     //         } else {
//     //           window.sessionStorage.setItem(
//     //             "sharedAudios",
//     //             JSON.stringify([file.name])
//     //           );
//     //         }
//     //       })
//     //     );
//     //   })()
//     // );
//   }
// });

// log that service worker is installed
console.log("service worker installed");
