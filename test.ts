import express from "express";
import cors from "cors";

import summaryRoute from "./routes/summary.js";
import progressRoute from "./routes/progress.js";
import kpisRoute from "./routes/kpis.js";
import impactRoute from "./routes/impact.js";
import sectionsRoute from "./routes/sections.js";
import cardsRoute from "./routes/cards.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/summary", summaryRoute);
app.use("/api/progress", progressRoute);
app.use("/api/kpis", kpisRoute);
app.use("/api/impact-by-platform", impactRoute);
app.use("/api/sections", sectionsRoute);
app.use("/api/cards", cardsRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Mock API running on http://localhost:${port}`));