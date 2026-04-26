Deploy Guide
Current app state
This project can be deployed as a Node web service right now.

The server already supports:

PORT from the deployment platform
HOST override
static asset serving
cookie-based login
Important data note
The app now supports two storage modes:

local development: data/store.json
deployed environment: Postgres via DATABASE_URL
If DATABASE_URL is present, the app stores all users, predictions, bracket state, and results in Postgres.
If DATABASE_URL is missing, it falls back to data/store.json.

Best deployment fit
1. Render Free Web Service + Render Postgres
Good for:

quick public test deployment
free onrender.com URL
simple Node deployment
deploy/restart-safe app data when connected to Postgres
Limits for this app:

free services spin down on idle
free Postgres expires 30 days after creation on Render's free tier
Use this if you want a free public demo and can accept Render free-tier database expiration limits.

2. Railway Trial / Low-cost
Good for:

easier always-on testing
more server-like deployment
Limits for this app:

not truly permanently free
you should still move away from file storage for reliability
Render deploy steps
Push this folder to GitHub.
Create a new Render Web Service from that repo.
Render should detect:
Build Command: npm install
Start Command: npm start
Create a Render Postgres database.
In the web service settings, add:
DATABASE_URL = your Postgres connection string
DATABASE_SSL = false for Render internal connections
Deploy.
Share the generated *.onrender.com URL.
Recommended next step for real public use
Before long-term public release, move from a single JSON blob in Postgres to structured tables.
That will make future features and analytics easier, but it is no longer required for deploy-safe persistence.
