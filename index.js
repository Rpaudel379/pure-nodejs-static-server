import fs from "fs";
import http from "http";
import path from "path";
import ejs from "ejs";
import { renderPage } from "./renderPage.js";
import mimeTypes from "./mimeTypes.js";

const staticFolderDir = path.join(path.resolve(""), "static");
// create a http server

http
  .createServer(async (req, res) => {
    //? GET Requests
    if (req.method === "GET") {
      const url = req.url;

      let staticFileDir;
      let ext;
      if (url.includes(".css") || url.includes(".js")) {
        staticFileDir = path.join(staticFolderDir, url);
        ext = path.extname(staticFileDir);
      } else if (url.includes(".ico")) {
        res.end("");
        return;
      } else if (["png", "jpg", "svg", "gif"].includes(url.split(".")[1])) {
        staticFileDir = path.join(staticFolderDir, url);
        ext = path.extname(staticFileDir);
      } else {
        if (url === "/") {
          staticFileDir = path.join(staticFolderDir, "templates", "index.ejs");
        } else {
          staticFileDir = path.join(staticFolderDir, "templates", url + ".ejs");
        }
        ext = path.extname(staticFileDir);
      }

      let options;

      if (ext === ".ejs" || ext === ".css" || ext === ".js") {
        options = { encoding: "utf8" };
      } else {
        options = undefined;
      }

      const renderReturns = await renderPage(staticFileDir, options);
      const pageFound = renderReturns.pageFound;
      const file = renderReturns.file;

      res.writeHead(200, { "Content-Type": mimeTypes[ext] });

      if (pageFound) {
        if (options) {
          res.end(ejs.render(file, { name: "anish" }));
        } else {
          res.end(file);
        }
      } else {
        res.end(ejs.render(file));
      }
    }
  })
  .listen(5000, () => {
    console.log("listening to port 5000");
  });
