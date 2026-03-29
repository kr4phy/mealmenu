# Meal Menu

A Nuxt 4 web app for viewing school meal menus by date.

This project fetches meal data from the NEIS Open API and displays it in tabbed views (Breakfast, Lunch, Dinner).

## Features

- View today's meal menu on the home page.
- Open a date-specific page and browse meals for any selected date.
- Save school identifiers in local storage from the settings page.
- Search school information through NEIS school lookup.

## Tech Stack

- Nuxt 4
- Vue 3 + Vue Router
- Nuxt UI
- Tailwind CSS 4
- TypeScript

## Development Runtime

This project was developed with Bun and is configured with Bun as the primary runtime/tooling choice.

- `packageManager` is set to Bun in `package.json`.
- Nitro preset is set to Bun in `nuxt.config.ts`.

## Requirements

- Bun 1.3+ (recommended)
- Node.js 20+ is optional if you prefer npm/pnpm/yarn workflows

## Installation

Install dependencies with Bun (recommended).

```bash
# bun (recommended)
bun install

# pnpm
pnpm install

# npm
npm install

# yarn
yarn install
```

## Configuration

Meal requests require two NEIS school identifiers:

- `ATPT_OFCDC_SC_CODE`
- `SD_SCHUL_CODE`

You can provide them in either of the following ways:

1. Runtime config (default values)
2. Settings page local storage (takes precedence in the browser)

### Option 1: Runtime Config

Set these in your environment as public Nuxt runtime config values:

- `NUXT_PUBLIC_ATPT_OFCDC_SC_CODE`
- `NUXT_PUBLIC_SD_SCHUL_CODE`

Example (PowerShell):

```powershell
$env:NUXT_PUBLIC_ATPT_OFCDC_SC_CODE="YOUR_REGION_CODE"
$env:NUXT_PUBLIC_SD_SCHUL_CODE="YOUR_SCHOOL_CODE"
bun run dev
```

### Option 2: In-App Settings

1. Go to `/settings`.
2. Use **Find School** to look up your school by city/province and name.
3. Save settings.

Saved values are stored in browser local storage and are used before runtime defaults.

## Run Locally

Start the development server:

```bash
# bun (recommended)
bun run dev

# pnpm
pnpm dev

# npm
npm run dev

# yarn
yarn dev
```

Default URL: `http://localhost:3000`

## Available Routes

- `/` : Today's meal menu and date picker entry point
- `/selectedMealMenu?date=YYYY-M-D` : Meal menu for a selected date
- `/settings` : School code setup and lookup

## Scripts

- `dev`: Start development server
- `build`: Build production bundle
- `preview`: Preview production build locally
- `generate`: Generate static output
- `lint`: Run ESLint
- `typecheck`: Run Nuxt type checking

## Production

Build:

```bash
bun run build
```

Preview production build:

```bash
bun run preview
```

Because this project uses the Bun Nitro preset, verify your deployment environment supports your chosen runtime target.

## API Notes

- Meal data endpoint: `https://open.neis.go.kr/hub/mealServiceDietInfo`
- School lookup endpoint: `https://open.neis.go.kr/hub/schoolInfo`
- Menu text is parsed from NEIS `DDISH_NM` content by splitting line breaks and trimming allergy number suffixes.

## Regional Support Note

This app currently targets South Korea because it relies on NEIS OpenAPI.

If you want to use this project outside Korea, you need to adapt API integration logic in `app/lib/apiHandler.ts`, including:

- Replacing NEIS endpoints with a region-specific school meal API
- Updating request query parameters and response types
- Adjusting meal parsing logic (currently based on NEIS `DDISH_NM` format)
- Revising school lookup behavior for your region's data source

## Troubleshooting

- If meals are empty, confirm school codes are correct.
- If school search returns multiple results, provide a more specific school name.
- If API calls fail, retry later and check network access to `open.neis.go.kr`.

## References

- Nuxt documentation: https://nuxt.com/docs
- Nuxt deployment guide: https://nuxt.com/docs/getting-started/deployment
- NEIS Open API portal: https://open.neis.go.kr
