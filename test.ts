import fs from "fs";
import countries from "world-countries";

// Generate JSON with the fields we need
const output = countries.map(c => ({
  name: c.name.common,      // e.g. "United States"
  code: c.cca2,             // ISO Alpha-2 code (e.g. "US")
  region: c.region,         // Continent (e.g. "Americas")
  subregion: c.subregion,   // Subregion (e.g. "North America")
  lat: c.latlng[0],         // Latitude
  lng: c.latlng[1],         // Longitude
  uniqueSkills: 0,          // Placeholder for your data
  skillSupply: 0            // Placeholder for your data
}));

// Save into Angular assets folder
fs.writeFileSync(
  "./src/assets/data/world-skill-data.json",
  JSON.stringify({ countries: output }, null, 2)
);

console.log("✅ world-skill-data.json generated with", output.length, "countries.");
