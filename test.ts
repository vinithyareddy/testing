// FE/scripts/generate-skills-data.js

const fs = require("fs");
const countries = require("world-countries");

// Build JSON with required fields
const output = countries.map(c => ({
  name: c.name.common,       // e.g. "United States"
  code: c.cca2,              // ISO Alpha-2 code
  region: c.region,          // Continent (e.g. "North America")
  subregion: c.subregion,    // Subregion (e.g. "Southern Asia")
  lat: c.latlng[0],          // Latitude
  lng: c.latlng[1],          // Longitude
  uniqueSkills: 0,           // Placeholder for your widget
  skillSupply: 0             // Placeholder for your widget
}));

// Ensure assets/data folder exists
const outDir = "./src/assets/data";
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Save JSON file
fs.writeFileSync(
  `${outDir}/world-skill-data.json`,
  JSON.stringify({ countries: output }, null, 2)
);

console.log("✅ world-skill-data.json generated with", output.length, "countries.");
