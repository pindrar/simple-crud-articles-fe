# Running the Article Dashboard

## Prerequisites

- **Node.js** 18+ (`node --version` to check)
- **npm** 9+ (comes with Node.js)
- The **Go backend** running locally or deployed — see `../learn-be/RUNNING.md`

---

## 1. Install dependencies

```bash
npm install
```

---

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8085
```

Change the URL to point to wherever the Go backend is running:
- Local: `http://localhost:8085` (or whichever `SERVER_PORT` you set)
- Vercel: `https://<your-backend-project>.vercel.app`

---

## 3. Run in development mode

```bash
npm run dev
```

The dashboard will be available at **http://localhost:3000**.

Hot reload is enabled — changes to files are reflected immediately in the browser.

---

## 4. Build for production

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

---

## 5. Deploy to Vercel

### Install Vercel CLI

```bash
npm install -g vercel
```

### Deploy

```bash
vercel
```

Follow the prompts. On first deploy, Vercel will detect it as a Next.js project automatically.

### Set environment variable in Vercel

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables** and add:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `https://<your-backend>.vercel.app` |

Then redeploy:

```bash
vercel --prod
```

---

## Pages

| URL | Description |
|---|---|
| `/` | Redirects to `/dashboard/posts` |
| `/dashboard/posts` | List all articles (Published / Drafts / Trashed tabs) |
| `/dashboard/posts/new` | Create a new article |
| `/dashboard/posts/:id/edit` | Edit an existing article |
| `/preview` | Public blog view — shows Published articles only |

---

## Available Scripts

```bash
npm run dev    # start development server with hot reload
npm run build  # build for production
npm start      # start production server (requires build first)
npm run lint   # run ESLint
```
