const { join } = require("path");

// Pin Puppeteer's Chromium download into a project-local cache so the Vercel
// build finds the browser at build time. npm install and the build step share
// the workspace, but the default ~/.cache/puppeteer location is not always
// resolved on Vercel — this is the standard, lightweight fix.
module.exports = {
  cacheDirectory: join(__dirname, "node_modules", ".cache", "puppeteer"),
};
