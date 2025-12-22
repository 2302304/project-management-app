# 🚀 Deployment Guide - Railway & Vercel

## 📋 Esitiedot

Ennen julkaisua tarvitset:
- ✅ GitHub-tilin (sovellus Gitissä)
- ✅ Railway-tilin (https://railway.app)
- ✅ Vercel-tilin (https://vercel.com)

---

## 🗄️ VAIHE 1: Railway (Backend + Database)

### 1.1 Luo Railway-projekti

1. Mene osoitteeseen: https://railway.app
2. Kirjaudu sisään GitHub-tilillä
3. Klikkaa **"New Project"**
4. Valitse **"Deploy from GitHub repo"**
5. Valitse tämä repository

### 1.2 Lisää PostgreSQL

1. Railway-projektissa klikkaa **"+ New"**
2. Valitse **"Database" → "Add PostgreSQL"**
3. Railway luo automaattisesti tietokannan

### 1.3 Konfiguroi Backend

1. Klikkaa backend-servicea
2. Mene **"Variables"**-välilehdelle
3. Lisää seuraavat ympäristömuuttujat:

```bash
# Railway antaa automaattisesti:
DATABASE_URL  # Kopioi PostgreSQL-servicestä

# Lisää nämä MANUAALISESTI:
NODE_ENV=production

# GENEROI UUDET AVAIMET (ÄLÄ käytä kehitysavaimia!):
JWT_SECRET=<GENEROI_UUSI_128_MERKKIÄ>
REFRESH_TOKEN_SECRET=<GENEROI_UUSI_128_MERKKIÄ>

# Token expirations:
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d

# PÄIVITÄ MYÖHEMMIN Vercel URLilla:
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**Generoi uudet secretit:**
```bash
# Lokaalissa terminaalissa:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 1.4 Konfiguroi Root Directory

1. Backend-servicen **"Settings"**
2. Etsi **"Root Directory"**
3. Aseta: `backend`
4. **"Start Command"**: `npx prisma migrate deploy && npm start`

### 1.5 Deploy

1. Railway buildaa ja deployaa automaattisesti
2. Saat public URL:n (esim: `https://project-xxx.railway.app`)
3. **TALLENNA TÄMÄ URL** - tarvitset sitä Vercelissä!

### 1.6 Aja migraatiot (jos tarpeen)

Railway ajetaan migraatiot automaattisesti start commandissa. Jos tarvitset manuaalisen ajon:

1. Railway dashboard → Backend service
2. Klikkaa **"..."** → **"View Logs"**
3. Tarkista että migraatiot onnistuivat

---

## 🎨 VAIHE 2: Vercel (Frontend)

### 2.1 Luo Vercel-projekti

1. Mene: https://vercel.com
2. Kirjaudu GitHub-tilillä
3. Klikkaa **"Add New..." → "Project"**
4. Valitse tämä repository
5. Konfiguroi:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.2 Lisää Environment Variables

Vercel-projektin **"Settings" → "Environment Variables"**:

```bash
# Backend URL Railway:stä (TÄRKEÄ!):
VITE_API_URL=https://your-railway-app.railway.app/api

# WebSocket URL:
VITE_WS_URL=https://your-railway-app.railway.app
```

⚠️ **HUOM:** Vaihda `your-railway-app.railway.app` oikeaksi Railway URLiksi!

### 2.3 Deploy

1. Klikkaa **"Deploy"**
2. Vercel buildaa ja julkaisee
3. Saat URL:n (esim: `https://your-app.vercel.app`)

---

## 🔄 VAIHE 3: Päivitä Railway CORS

Nyt kun tiedät Vercel URL:n, päivitä Railway:

1. Railway → Backend service → **"Variables"**
2. Päivitä:

```bash
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app
```

3. Railway deployaa automaattisesti uudelleen

---

## ✅ VAIHE 4: Testaa deployment

1. Avaa Vercel URL selaimessa
2. Kokeile kirjautua:
   - Email: `testi@example.com`
   - Salasana: `salasana123`

### Jos kirjautuminen EI toimi:

**Tarkista CORS-virheet:**
1. Avaa selaimen Developer Tools (F12)
2. Console-välilehti
3. Etsi CORS-virheitä

**Korjaus:**
- Varmista että `ALLOWED_ORIGINS` Railway:ssä on TÄSMÄLLEEN sama kuin Vercel URL
- Ei "/" lopussa
- HTTPS (ei HTTP)

---

## 🗂️ DEPLOYMENT-PROSESSIN LOGIIKKA

### Railway Backend:

```
1. GitHub push
   ↓
2. Railway havaitsee muutoksen
   ↓
3. Railway lukee: backend/package.json
   ├─ "build": "prisma generate && tsc"
   └─ "start": "node dist/server.js"
   ↓
4. Railway buildaa:
   ├─ npm install (asentaa dependencies)
   ├─ npm run build (TypeScript → JavaScript)
   └─ Prisma generate (luo client)
   ↓
5. Railway käynnistää:
   ├─ npx prisma migrate deploy (aja migraatiot)
   └─ npm start (käynnistä server)
   ↓
6. Backend pyörii: https://xxx.railway.app
```

### Vercel Frontend:

```
1. GitHub push
   ↓
2. Vercel havaitsee muutoksen
   ↓
3. Vercel lukee: frontend/package.json
   └─ "build": "tsc -b && vite build"
   ↓
4. Vercel buildaa:
   ├─ npm install
   ├─ TypeScript-käännös
   ├─ Vite bundle (dist/)
   └─ Optimoi assets
   ↓
5. Vercel julkaisee CDN:ään
   ├─ Staattiset tiedostot
   ├─ Nopea lataus (edge)
   └─ HTTPS automaattisesti
   ↓
6. Frontend saatavilla: https://xxx.vercel.app
```

---

## 📁 Mitkä tiedostot vaikuttavat deploymenttiin?

### Railway (Backend):
- ✅ `backend/package.json` → Käynnistyskomennot
- ✅ `backend/Dockerfile` (valinnainen, Railway hoitaa ilmankin)
- ✅ `railway.json` (valinnainen, lisäasetukset)
- ✅ `backend/prisma/schema.prisma` → Tietokantamalli
- ✅ Environment Variables (Railway dashboardissa)

### Vercel (Frontend):
- ✅ `frontend/package.json` → Build script
- ✅ `frontend/vite.config.ts` → Build-asetukset
- ✅ `vercel.json` (valinnainen, lisäasetukset)
- ✅ Environment Variables (Vercel dashboardissa)

---

## 🔧 Yleisiä ongelmia ja ratkaisuja

### Ongelma: "CORS Error" tuotannossa

**Syy:** Backend ei hyväksy Vercel URL:ia

**Ratkaisu:**
```bash
# Railway Variables:
ALLOWED_ORIGINS=https://exact-vercel-url.vercel.app

# EI:
ALLOWED_ORIGINS=http://...  ❌ (HTTP)
ALLOWED_ORIGINS=.../         ❌ (slash lopussa)
```

---

### Ongelma: "Cannot connect to database"

**Syy:** DATABASE_URL puuttuu tai on väärä

**Ratkaisu:**
1. Railway → PostgreSQL service
2. Kopioi **"DATABASE_URL"**
3. Railway → Backend service → Variables
4. Liitä DATABASE_URL

---

### Ongelma: "Prisma Client not found"

**Syy:** Prisma Client ei generoitunut buildissa

**Ratkaisu:**
```json
// backend/package.json
{
  "scripts": {
    "build": "prisma generate && tsc",  // Varmista että generate on!
    "postinstall": "prisma generate"     // Varmuuden vuoksi
  }
}
```

---

### Ongelma: "Port already in use"

**Syy:** Railway yrittää käyttää väärää porttia

**Ratkaisu:**
```typescript
// backend/src/server.ts
const PORT = process.env.PORT || 3000;  // Railway asettaa PORT:n automaattisesti
```

---

## 🔄 Päivitykset tuotantoon

### Deployment automaattisesti:

```bash
# Lokaalissa:
git add .
git commit -m "Update feature"
git push origin main

# Railway ja Vercel deployaavat automaattisesti!
```

### Manuaalinen redeployment:

**Railway:**
1. Dashboard → Service
2. "..." → "Redeploy"

**Vercel:**
1. Dashboard → Project
2. "Deployments" → "Redeploy"

---

## 📊 Monitoring & Logs

### Railway Logs:
1. Dashboard → Backend service
2. "View Logs"
3. Real-time logs

### Vercel Logs:
1. Dashboard → Project
2. "Deployments" → Klikkaa deploymenttiä
3. "Build Logs" tai "Function Logs"

---

## 🎯 Checklist ennen ensimmäistä deploymenttiä:

### Backend (Railway):
- [ ] PostgreSQL-service luotu
- [ ] DATABASE_URL kopioitu backendiin
- [ ] UUDET JWT secretit generoitu
- [ ] NODE_ENV=production
- [ ] Root directory: `backend`
- [ ] Start command: `npx prisma migrate deploy && npm start`

### Frontend (Vercel):
- [ ] Root directory: `frontend`
- [ ] VITE_API_URL Railway URLilla
- [ ] VITE_WS_URL Railway URLilla
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### Railway CORS:
- [ ] FRONTEND_URL päivitetty Vercel URLilla
- [ ] ALLOWED_ORIGINS päivitetty Vercel URLilla

### Testaus:
- [ ] Kirjautuminen toimii
- [ ] Projektien haku toimii
- [ ] CORS ei estä pyyntöjä
- [ ] Console ei näytä virheitä

---

## 🆘 Tuki

Jos kohtaat ongelmia:
1. Tarkista logi Railway/Vercel dashboardista
2. Tarkista environment variables
3. Tarkista CORS-asetukset
4. Tarkista että DATABASE_URL on oikein

---

**Onnea deploymenttiin! 🚀**
