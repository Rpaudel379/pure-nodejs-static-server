import fs from "fs";
import http from "http";
import path from "path";
import ejs from "ejs";

const staticFolderDir = path.join(path.resolve(""), "static");
const errorPage = path.join(staticFolderDir, "templates", "404.ejs");
const mimeTypes = {
  ".html": "text/html",
  ".ejs": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".woff": "application/font-woff",
  ".ttf": "application/font-ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "application/font-otf",
  ".wasm": "application/wasm",
};

// create a http server

http
  .createServer((req, res) => {
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

      fs.readFile(staticFileDir, options, (err, page) => {
        if (err) {
          fs.readFile(errorPage, { encoding: "utf8" }, (err, errPage) => {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(errPage);
          });
        } else {
          res.writeHead(200, { "Content-Type": mimeTypes[ext] });
          if (!options) {
            res.end(page);
          } else {
            res.end(ejs.render(page, { name: "anish" }));
          }
        }
      });
    }
  })
  .listen(5000, () => {
    console.log("listening to port 5000");
  });
