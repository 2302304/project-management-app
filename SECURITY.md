# 🔒 Tietoturva-ohjeisto

## 🔑 JWT Token Management

### Kehitysympäristö
- ✅ Vahvat 128-merkiset avaimet generoitu
- ✅ Erilliset JWT access ja refresh token secretit
- ✅ Token expiration: 7 päivää (access), 30 päivää (refresh)

### Tuotantoympäristö

**KRIITTISTÄ ennen deploymenttia:**

1. **Generoi UUDET tuotantoavaimet**
   ```bash
   # JWT Secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

   # Refresh Token Secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **ÄLÄ KOSKAAN:**
   - Committaa tuotantoavaimia Gitiin
   - Käytä kehitysavaimia tuotannossa
   - Jaa salaisuuksia julkisesti
   - Tallenna avaimia selkotekstinä koodiin

3. **Tallenna tuotantoavaimet turvallisesti:**
   - Railway: Environment Variables -välilehti
   - Vercel: Environment Variables -asetukset
   - Lokaalisti: Käytä `.env.local` (gitignoressa)

---

## 🛡️ CORS (Cross-Origin Resource Sharing)

### Nykyiset asetukset
```
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176"
```

### Tuotannossa
Päivitä `ALLOWED_ORIGINS` sisältämään VAIN tuotanto-URL:

**Railway .env:**
```
ALLOWED_ORIGINS="https://your-app.vercel.app"
```

**Älä koskaan salli:**
- `*` (kaikki domainit) tuotannossa
- HTTP-protokollaa tuotannossa (vain HTTPS)
- Tuntemattomia domaineja

---

## 🗄️ Tietokanta-turvallisuus

### PostgreSQL-salasanat

**Kehitys:**
- Nykyinen: `pmpassword` (heikko, mutta OK lokaalille)

**Tuotanto (Railway):**
1. ✅ Railway generoi vahvan salasanan automaattisesti
2. ✅ Käytä aina SSL-yhteyttä (`?sslmode=require`)
3. ✅ Rajoita IP-osoitteita tarvittaessa

### Prisma-migraatiot

**Tuotannossa:**
```bash
# ÄLÄ aja "migrate dev" tuotannossa!
npx prisma migrate deploy

# Tarkista ennen deploymenttia:
npx prisma migrate status
```

---

## 🔐 Salasanojen hashays

### Toteutus
- ✅ bcrypt v6.0.0
- ✅ Salt rounds: 10 (oletus, riittävä)
- ✅ Ei koskaan tallenneta selkokielisiä salasanoja

### Käyttäjäsalasanojen vahvuus

**Suositukset frontend-validointiin:**
```typescript
// Lisää tulevaisuudessa RegisterPage:lle
- Min. 8 merkkiä
- Vähintään 1 iso kirjain
- Vähintään 1 numero
- Vähintään 1 erikoismerkki
```

---

## 🌐 HTTPS & SSL/TLS

### Tuotannossa PAKOLLISTA:
- ✅ Vercel: HTTPS automaattisesti
- ✅ Railway: HTTPS automaattisesti
- ✅ Tietokantayhteys SSL:llä

### Content Security Policy (CSP)

**Lisää tulevaisuudessa backend-headereihin:**
```typescript
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'");
  next();
});
```

---

## 🚫 Input Validation

### Nykyinen toteutus
- ✅ Zod-validointi frontendissä
- ✅ Express-validator backendissä
- ✅ Prisma type safety

### Parannettavaa
- ⚠️ Rate limiting (estää brute force)
- ⚠️ Request size limits
- ⚠️ SQL injection -suojaus (Prisma hoitaa automaattisesti ✅)

---

## 📝 Lokitus & Monitoring

### Älä koskaan lokita:
- ❌ Salasanoja
- ❌ JWT tokeneja
- ❌ Luottokorttitietoja
- ❌ Henkilökohtaisia tunnisteita (GDPR)

### Lokita:
- ✅ Kirjautumisyritykset
- ✅ Epäonnistuneet autentikointikyrit
- ✅ API-virheet
- ✅ Kriittiset toiminnot (poistot, muokkaukset)

---

## 🔄 Dependency Management

### Turvallisuuspäivitykset

**Säännölliset tarkistukset:**
```bash
# Frontend
cd frontend && npm audit

# Backend
cd backend && npm audit

# Korjaa haavoittuvuudet
npm audit fix
```

**Huomio kriittisiin paketteihin:**
- jsonwebtoken
- bcrypt
- express
- @prisma/client

---

## 🚀 Pre-Deployment Checklist

### Ennen tuotantoon viemistä:

#### Backend (Railway):
- [ ] Generoi uudet JWT secretit
- [ ] Päivitä ALLOWED_ORIGINS Vercel URLilla
- [ ] Vaihda NODE_ENV="production"
- [ ] Tarkista DATABASE_URL (Railway antaa)
- [ ] Testaa Prisma-migraatiot
- [ ] Poista kaikki console.log -debuggaukset

#### Frontend (Vercel):
- [ ] Päivitä VITE_API_URL Railway URLilla
- [ ] Päivitä VITE_WS_URL Railway URLilla
- [ ] Build onnistuu virheettä
- [ ] Tarkista CSP-headerit
- [ ] Testaa CORS-asetukset

#### Tietokanta:
- [ ] Aja seed vain kerran tuotannossa
- [ ] Varmuuskopioi data säännöllisesti
- [ ] Aseta vahvat käyttäjäoikeudet

#### Testaus tuotannossa:
- [ ] Kirjautuminen toimii
- [ ] CORS ei estä pyyntöjä
- [ ] JWT tokenin uusiminen toimii
- [ ] Logout toimii oikein
- [ ] Kaikki API-endpointit vastaavat

---

## 📞 Tietoturvaongelmien raportointi

Jos löydät tietoturva-aukon:
1. **ÄLÄ** julkaise sitä julkisesti
2. Ota yhteyttä projektin ylläpitoon
3. Anna yksityiskohtainen kuvaus
4. Odota korjausta ennen julkistamista

---

## 🔄 Päivitetty viimeksi
2024-12-22

**Generoidut JWT secretit:**
- ✅ JWT_SECRET: 128 merkkiä (SHA-512)
- ✅ REFRESH_TOKEN_SECRET: 128 merkkiä (SHA-512)
- ⚠️ **VAIHDA NÄMÄ TUOTANNOSSA!**
