import express from "express";
import cors from "cors";
import { shortenRoutes } from "./router/router.js";

const app = express();

app.use(cors());
app.use(express.json());
const PORT = 5000;
app.use(shortenRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
