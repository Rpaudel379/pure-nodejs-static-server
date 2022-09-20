import path from "path";
import fs from "fs/promises";

const staticFolderDir = path.join(path.resolve(""), "static");
const errorPage = path.join(staticFolderDir, "templates", "404.ejs");


export const renderPage = async (staticFileDir, options) => {
  let pageFound = false;

  let file;
  try {
    file = await fs.readFile(staticFileDir, options);
    pageFound = true;
  } catch (error) {
    if (error.code === "ENOENT") {
      file = await fs.readFile(errorPage, { encoding: "utf-8" });
    }
  }

  return { pageFound, file };
};
