# testing


https://prod.liveshare.vsengsaas.visualstudio.com/join?D2B03B2C774D7D2232BDFD40E77AE916A0CE
https://prod.liveshare.vsengsaas.visualstudio.com/join?65320D20FBA1FA9F3688C5FFFCF22A39CEE6


I am working in the  repository. I need to add a new 
timezone lookup service endpoint. Please analyze the existing codebase 
structure first — look at how existing endpoints are organized, how 
Spanner is configured and queried, how request/response models are 
defined, and how routing/controllers are structured. Then replicate 
that exact same pattern for the new timezone feature.

---

TASK: Build a timezone lookup endpoint

ENDPOINT:
- Method: POST
- Path: /timezone/lookup  (follow whatever base path pattern exists in this repo)

---

REQUEST BODY:
{
  "address_line1": "123 Main St",    // optional
  "address_line2": "Apt 4",          // optional
  "city": "New York",                // optional
  "state": "NY",                     // optional
  "zip_code": "10001"                // MANDATORY - validate this is present
}

RESPONSE BODY:
{
  "zip_code": "10001",
  "centroid_lat": 40.7484,
  "centroid_lng": -73.9967,
  "time_zone": "America/New_York"
}

ERROR RESPONSE (if zip_code missing or not found):
{
  "error": "zip_code is required"    // 400 if missing
  "error": "No timezone data found for zip_code: 10001"  // 404 if not in table
}

---

SPANNER TABLE:
Create this table in Spanner (use the same Spanner instance/database 
already configured in this repo):

CREATE TABLE zip_timezone (
  zip_code    STRING(10)  NOT NULL,
  centroid_lat FLOAT64,
  centroid_lng FLOAT64,
  time_zone   STRING(100)
) PRIMARY KEY (zip_code);

Insert these dummy rows for development/testing:

INSERT INTO zip_timezone (zip_code, centroid_lat, centroid_lng, time_zone)
VALUES
  ('10001', 40.7484, -73.9967, 'America/New_York'),
  ('90001', 33.9731, -118.2479, 'America/Los_Angeles'),
  ('60601', 41.8858, -87.6181, 'America/Chicago'),
  ('77001', 29.7543, -95.3677, 'America/Chicago'),
  ('85001', 33.4484, -112.0740, 'America/Phoenix'),
  ('98101', 47.6062, -122.3321, 'America/Los_Angeles'),
  ('30301', 33.7490, -84.3880, 'America/New_York'),
  ('80201', 39.7392, -104.9903, 'America/Denver'),
  ('96801', 21.3069, -157.8583, 'Pacific/Honolulu'),
  ('00901', 18.4655, -66.1057, 'America/Puerto_Rico');

---

LOGIC:
1. Validate zip_code is present in request body — return 400 if missing
2. Query Spanner: SELECT zip_code, centroid_lat, centroid_lng, time_zone 
   FROM zip_timezone WHERE zip_code = @zip_code
3. If no row found, return 404 with error message
4. If found, return 200 with the zip_code, centroid_lat, centroid_lng, 
   and time_zone

---

FILES TO CREATE:
Follow the exact same file structure and naming convention already used 
in this repo for other endpoints. Typically this would include:
- A request/response model or DTO
- A service/repository layer that handles the Spanner query
- A controller that handles routing and calls the service
- Any necessary dependency injection wiring

Do NOT invent a new pattern — mirror exactly what exists for other 
endpoints in this repo.

---

NOTES:
- This is a temporary dummy table for development. The real table will 
  eventually have ~45,000 US zip codes with accurate centroids and 
  timezones loaded from BigQuery.
- zip_code is the only lookup key — no geo/polygon logic needed here, 
  that is handled upstream in BigQuery.
- Keep the code clean and easy to swap the dummy data for real data 
  later with no structural changes needed.
