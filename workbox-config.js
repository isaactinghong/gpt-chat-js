module.exports = {
  globDirectory: "web-build/",
  globPatterns: ["**/*.{json,png,ico,html,js,txt,ttf}"],
  globIgnores: [
    "**/.1feff74faaf0efc6a044", // Add a pattern here that matches the file to exclude
    "_redirects",
  ],
  swDest: "web-build/sw.js",
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
};
