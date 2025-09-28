import { readFile, writeFile } from "fs/promises";
import { randomBytes } from "crypto";
import express from "express";
const FILE_PATH = "./Data/urls.json";
const router = express.Router();
const readUrlFile = async () => {
  try {
    let data = await readFile(FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// ✅ Default route
router.get("/", (req, res) => {
  res.send("🚀 URL Shortener Backend is Running!");
});
//Data get for the front route
router.get("/urls", async (req, res) => {
  let urls = await readUrlFile();
  res.json(urls);
});

//route for the shorten url
router.post("/shorten", async (req, res) => {
  // console.log(req.body);
  // console.log(req.query);
  let { originalUrl } = req.body;
  let urls = await readUrlFile();
  let exsistingUrl = urls.find((url) => url.originalUrl === originalUrl);
  if (exsistingUrl) {
    return res
      .status(200)
      .json({ message: "URl Already Exsist!", data: exsistingUrl });
  } else {
    let shortenUrl = randomBytes(2).toString("hex");
    let newEntry = { originalUrl: originalUrl, shortUrl: shortenUrl };
    urls.push(newEntry);
    await writeFile(FILE_PATH, JSON.stringify(urls, null, 2));
    return res
      .status(201)
      .json({ message: "URl Shorten Succesfully!", data: newEntry });
  }
});
//route for dynamic page to url
router.use("/:code", async (req, res) => {
  const { code } = req.params;
  let urls = await readUrlFile();
  let urlCode = urls.find((url) => url.shortUrl === code);
  if (urlCode) {
    return res.redirect(urlCode.orignalUrl);
  } else {
    return res.status(404).json({ message: "Short URL not found" });
  }
});

export const shortenRoutes = router;
