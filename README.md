# StackGuard — MERN Assignment (Auth → Config → Dashboard)

**Flow:** Sign In/Up → Config key (100–1000 chars) → Dashboard (blocked until configured).

## Quick Start
```bash
# Backend
cd server
cp .env.example .env
npm i
# ensure mongod is running locally
npm run dev

# Frontend
cd ../client
cp .env.example .env
npm i
npm run dev
```

Open http://localhost:5173

## Seed User
```bash
cd server
npm run seed -- --email demo@stackguard.dev --password password123 --configured --key "$(node -e 'console.log("x".repeat(120))')"
```

## Deploy
- **Backend**: Heroku (Procfile) / Render (render.yaml)
- **Frontend**: Vercel (vercel.json) / Netlify (netlify.toml)
