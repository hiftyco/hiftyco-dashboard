# Hifty Co Trading Dashboard

A web dashboard to monitor and trigger trading cron jobs.

## Features
- View system status
- Trigger daily research
- Trigger morning briefing
- View trading journal
- Monitor market data

## Setup

```bash
npm install express
node server.js
```

## Environment Variables
Create a `.env` file:
```
PORT=3000
```

## Deploy to Vercel
```bash
npm i -g vercel
vercel
```

## Endpoints
- `GET /` - Dashboard
- `GET /api/research` - Run daily research
- `GET /api/briefing` - Run morning briefing
- `GET /api/system` - Run system check
