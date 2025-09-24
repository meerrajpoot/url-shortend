// import express from "express";
// import cors from "cors";
// import { readFile, writeFile } from "fs/promises";
// import { randomBytes } from "crypto";

// const app = express();
// const PORT = 5000;
// const FILE_PATH = "Data/urls.json";

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Helper: File read and convert string into an object
// const readUrls = async () => {
//   try {
//     const data = await readFile(FILE_PATH, "utf-8");
//     // console.log(JSON.parse(data));
//     return JSON.parse(data);
//   } catch (err) {
//     return [];
//   }
// };

// // Helper: File write convert into string form
// const writeUrls = async (urls) => {
//   return await writeFile(FILE_PATH, JSON.stringify(urls, null, 2));
// };

// // Short URL generate
// const generateShortUrl = () => {
//   return randomBytes(2).toString("hex");
// };

// // ✅ Default route
// app.get("/", (req, res) => {
//   res.send("🚀 URL Shortener Backend is Running!");
// });

// // ✅ Get all URLs
// app.get("/urls", async (req, res) => {
//   const urls = await readUrls();
//   res.json(urls);
// });

// // ✅ Create short URL
// app.post("/shorten", async (req, res) => {
//   const { originalUrl } = req.body;
//   let urls = await readUrls();

//   // Agar already exist kare to naya na banaye
//   const existing = urls.find((url) => url.originalUrl === originalUrl);
//   if (existing) {
//     return res.json({ message: "URL already exists", data: existing });
//   }

//   // Naya short URL generate karo
//   const shortUrl = generateShortUrl();
//   const newEntry = { originalUrl, shortUrl };

//   urls.push(newEntry);
//   await writeUrls(urls);

//   res.status(201).json({ message: "URL shortened", data: newEntry });
// });

// // ✅ Redirect short URL
// app.get("/:code", async (req, res) => {
//   const { code } = req.params;
//   // console.log(code);
//   const urls = await readUrls();
//   const url = urls.find((urlCode) => urlCode.shortUrl === code);

//   if (url) {
//     return res.redirect(url.originalUrl);
//   } else {
//     return res.status(404).json({ message: "Short URL not found" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });

import express from "express";
import cors from "cors";
import { readFile, writeFile } from "fs/promises";
import { randomBytes } from "crypto";

const app = express();

app.use(cors());
app.use(express.json());
const PORT = 5000;
const FILE_PATH = "Data/urls.json";

const readUrlFile = async () => {
  try {
    let data = await readFile(FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🚀 URL Shortener Backend is Running!");
});
//Data get for the front route
app.get("/urls", async (req, res) => {
  let urls = await readUrlFile();
  res.json(urls);
});

//route for the shorten url
app.use("/shorten", async (req, res) => {
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
app.use("/:code", async (req, res) => {
  const { code } = req.params;
  let urls = await readUrlFile();
  let urlCode = urls.find((url) => url.shortUrl === code);
  if (urlCode) {
    return res.redirect(urlCode.orignalUrl);
  } else {
    return res.status(404).json({ message: "Short URL not found" });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
