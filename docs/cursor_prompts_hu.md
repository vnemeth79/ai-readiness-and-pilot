# Cursor Promptok az AI Pilot Projekt Értékelő Eszköz Létrehozásához

## Bevezetés

Ez a dokumentum egy sorozat promptot tartalmaz a [Cursor](https://cursor.sh/) AI kódasszisztens számára, amelyek segítségével lépésről lépésre felépíthető egy teljes webalkalmazás az AI Pilot Projekt Értékelő Eszközhöz. A promptok a projekt teljes életciklusát lefedik, a kezdeti beállítástól a frontend és backend fejlesztésen át a telepítésig.

**Előfeltételek:**
- Telepített Cursor a gépeden.
- Hozzáférés egy LLM API-hoz (pl. OpenAI).
- Az összes kapcsolódó dokumentum (`README.md`, `prompt_package.md`, `implementation_guide.md`, stb.) egy projektmappában van elhelyezve, amelyet a Cursorral nyitsz meg.

**Hogyan használd:**
1. Hozz létre egy új projektmappát (pl. `ai-pilot-assessment-tool`).
2. Másold be az összes, korábban generált `.md` fájlt ebbe a mappába.
3. Nyisd meg a mappát a Cursorban.
4. A Cursor chat felületén add meg a promptokat az alábbi sorrendben. Minden prompt egy-egy fejlesztési fázist képvisel. Várd meg, amíg a Cursor befejezi az adott lépést, mielőtt a következőre ugranál.

---

## 1. Fázis: Projekt Előkészítése és Alapstruktúra

Ez a fázis létrehozza a projekt alapvető struktúráját, beállítja a szükséges technológiákat és konfigurációs fájlokat.

### Prompt 1.1: Projekt Inicializálása

**Cél:** A projekt alapvető mappaszerkezetének és konfigurációs fájljainak létrehozása.

```text
Olvass be minden `.md` fájlt a projektben, hogy teljes kontextusod legyen. Az `implementation_guide.md` alapján hozz létre egy monorepo struktúrát `pnpm` workspace-ekkel. A gyökérkönyvtárban hozz létre egy `packages` mappát, benne egy `frontend` és egy `backend` almappával. Inicializáld a `pnpm` workspace-t a gyökérkönyvtárban, és hozz létre egy alap `package.json` és `pnpm-workspace.yaml` fájlt.
```

### Prompt 1.2: Backend Beállítása (Node.js, Express, TypeScript)

**Cél:** A backend alkalmazás alapjainak létrehozása a `packages/backend` mappában.

```text
Navigálj a `packages/backend` mappába. Hozz létre egy Node.js projektet `pnpm` segítségével. Telepítsd az Express, TypeScript, `ts-node`, `nodemon` és a kapcsolódó `@types` csomagokat. Hozz létre egy `tsconfig.json` fájlt a megfelelő beállításokkal. Hozz létre egy `src` mappát, benne egy `index.ts` fájllal, ami egy egyszerű "Hello World" Express szervert indít a 4000-es porton. A `package.json`-be vedd fel a `dev` scriptet, ami a `nodemon` segítségével futtatja a szervert.
```

### Prompt 1.3: Frontend Beállítása (React, Vite, TypeScript, Tailwind CSS)

**Cél:** A frontend alkalmazás létrehozása a `packages/frontend` mappában a Vite segítségével.

```text
Navigálj a `packages/frontend` mappába. Hozz létre egy új React + TypeScript projektet a Vite segítségével. A projekt neve legyen `frontend`. A létrehozás után telepítsd a Tailwind CSS-t és a hozzá tartozó függőségeket (`postcss`, `autoprefixer`), majd inicializáld a `tailwind.config.js` és `postcss.config.js` fájlokat. Állítsd be a `tailwind.config.js`-t, hogy a `src` mappában lévő fájlokat figyelje. Végül, importáld a Tailwind alap stíluslapjait az `index.css`-be.
```

### Prompt 1.4: Környezeti Változók és API Kliens

**Cél:** Az API kulcsok biztonságos kezelésének beállítása.

```text
Mind a `frontend`, mind a `backend` csomagban hozz létre egy `.env.example` fájlt. A backend `.env.example` fájlba vedd fel az `OPENAI_API_KEY` változót. A frontend `.env.example` fájlba vedd fel a `VITE_API_BASE_URL=http://localhost:4000` változót. A backend oldalon telepítsd a `dotenv` csomagot, és a `backend/src/index.ts`-ben konfiguráld, hogy betöltse a környezeti változókat. Telepítsd az `openai` csomagot a backend-en és hozz létre egy `src/lib/openai.ts` fájlt, ami inicializálja és exportálja az OpenAI klienst.
```

---

## 2. Fázis: Backend API Endpontok Létrehozása

Ez a fázis a backend API endpontok implementálására fókuszál, amelyek a beszélgetést és az elemzést kezelik.

### Prompt 2.1: Beszélgetés Kezelő API Endpont

**Cél:** Egy API endpont létrehozása, ami kezeli a felhasználó és az AI közötti beszélgetést.

```text
Az `implementation_guide.md` és a `prompt_package.md` alapján a backend alkalmazásban hozz létre egy új API endpontot: `POST /api/chat`. Ez az endpont fogadja a felhasználó üzeneteit és a beszélgetés előzményeit. Az endpontnak a következőket kell tennie:
1. Fogadja a `messages` tömböt a request body-ból.
2. Olvassa be a `prompt_package.md`-ből a rendszer-promptot (a "System Prompt" szekció alatti részt).
3. Hozzon létre egy új OpenAI Chat Completion kérést a rendszer-prompttal és a kapott `messages` tömbbel.
4. Állítsd be a modellt `gpt-4.1-mini`-re és a `temperature`-t 0.7-re.
5. Engedélyezd a streaming választ, és küldd vissza a választ a kliensnek darabokban (server-sent events formájában).

Telepítsd a `cors` middleware-t és engedélyezd a frontend URL-ről (`http://localhost:5173`) érkező kéréseket.
```

### Prompt 2.2: Munkamenet (Session) Kezelés

**Cél:** A beszélgetési állapot tárolása a szerveren.

```text
Bővítsd a backend logikát egy egyszerű, memória-alapú munkamenet kezeléssel. Hozz létre egy `sessions` objektumot, ami a munkameneteket tárolja egyedi azonosítók alapján. A `/api/chat` endpontot módosítsd úgy, hogy opcionálisan fogadjon egy `sessionId`-t. Ha érkezik `sessionId`, használja a tárolt üzenetelőzményeket. Ha nem, hozzon létre egy új munkamenetet és egy új `sessionId`-t, amit visszaküld az első válasszal együtt. Ez biztosítja, hogy a beszélgetés állapota megmaradjon a kérések között.
```

---

## 3. Fázis: Frontend Felhasználói Felület (UI) Felépítése

Ebben a fázisban a React komponenseket és a felhasználói felületet hozzuk létre a frontend oldalon.

### Prompt 3.1: Chat Felület Komponens

**Cél:** A beszélgetési felület megalkotása.

```text
Az `implementation_guide.md` "Interface Design Principles" szekciója alapján hozz létre egy `ChatInterface.tsx` komponenst a `packages/frontend/src/components` mappában. Ennek a komponensnek a következőket kell tartalmaznia:
- Egy üzenetlista terület, ami megjeleníti a felhasználó és az AI üzeneteit. Különböztesd meg vizuálisan a két fél üzeneteit.
- Egy beviteli mező a felhasználói üzenetek számára, egy "Küldés" gombbal.
- Egy folyamatjelző sáv, ami mutatja, hogy a felhasználó a 14 kérdésből éppen hol tart (pl. "Question 3 of 14"). A 10. és 11. kérdésnél (AI readiness és strategic intent) a válaszlehetőségeket (A, B, C, D) gombokként jelenítsd meg, hogy a felhasználó egyszerűen kattintással választhasson.

Használj Tailwind CSS-t a stílusozáshoz, hogy egy letisztult, professzionális kinézetet kapj.
```

### Prompt 3.2: Állapotkezelés és API Integráció

**Cél:** A frontend állapotkezelésének és a backend API-val való kommunikációnak implementálása.

```text
Az `App.tsx`-ben vagy egy dedikált hook-ban (pl. `useChat.ts`) implementáld a következő logikát:
1. Használj `useState`-et az üzenetek (`messages`), a beviteli mező értékének és a betöltési állapotnak a tárolására.
2. Hozz létre egy függvényt, ami elküldi a felhasználó üzenetét a `POST /api/chat` backend endpontra.
3. Kezeld a streaming választ a backendtől. Ahogy érkeznek az adatok, fűzd hozzá az AI válaszát az üzenetek listájához, így a felhasználó látja, ahogy a válasz "gépelődik".
4. Miután a teljes válasz megérkezett, frissítsd az állapotot.
5. Integráld ezt a logikát a `ChatInterface.tsx` komponenssel.
```

### Prompt 3.3: Jelentés Megjelenítő Komponens

**Cél:** A végleges riport megjelenítésére szolgáló komponens létrehozása.

```text
Az `example_assessment.md` "Generated Report" szekciója alapján hozz létre egy `ReportDisplay.tsx` komponenst. Ez a komponens egy Markdown formátumú stringet kap propként, és azt HTML-ként jeleníti meg. Használj egy `markdown-to-jsx` vagy hasonló csomagot a rendereléshez. A komponensnek szépen formázva kell megjelenítenie a riportot, beleértve a táblázatokat, címsorokat és listákat. Adj hozzá egy "Letöltés PDF-ként" gombot (a funkcionalitást később implementáljuk).
```

---

## 4. Fázis: Teljes Folyamat és Haladó Funkciók

Ez a fázis összeköti a teljes folyamatot és hozzáadja a haladóbb funkciókat, mint a riport generálás és letöltés.

### Prompt 4.1: Folyamat Vezérlése

**Cél:** A teljes értékelési folyamat vezérlése a frontend oldalon.

```text
Bővítsd a frontend állapotkezelését egy folyamatvezérlő logikával. Az alkalmazásnak a következő állapotokon kell végigmennie:
1. `ASSESSMENT_START`: Kezdőképernyő, üdvözlő üzenet.
2. `ASSESSMENT_IN_PROGRESS`: A 14 kérdésből álló chat felület aktív.
3. `ANALYSIS`: Miután a 14. kérdésre is válaszolt a felhasználó, egy "Elemzés..." állapot jelenik meg, amíg a backend generálja a riportot.
4. `REPORT_READY`: A `ReportDisplay` komponens megjeleníti a kész riportot.

Implementáld a logikát, ami a backend válaszai alapján lépteti az állapotokat. A frontenden kövesd nyomon a kérdések számát. Miután a 14. kérdésre is megérkezett a válasz, válts `ANALYSIS` állapotra, és küldj egy új kérést a riport legenerálására.
```

### Prompt 4.2: Riport Generálási Kérés

**Cél:** Egy külön kérés implementálása a riport generálására.

```text
Hozz létre egy új backend endpontot: `POST /api/generate-report`. Ez az endpont egy `sessionId`-t fogad. Az endpontnak a következőket kell tennie:
1. Lekéri a munkamenethez tartozó teljes beszélgetés-előzményt.
2. Hozzáad egy utolsó instruciót a beszélgetéshez: "A fenti beszélgetés alapján, most generáld le a teljes riportot Markdown formátumban, a `prompt_package.md`-ben specifikált `Output Format` szerint. Különösen figyelj a `scoring_and_mapping_guide.md`-ben leírt `AI Strategic Intent Analysis` és `Prioritization Logic (Updated for Strategic Intent)` szekciókra, hogy a javaslatok összhangban legyenek az ügyfél stratégiai céljaival (Experimentation, Tool Adoption, vagy Strategic Transformation). A riportot a `### AI Pilot Project Readiness Report` címsorral kezdd. Ne írj semmi mást, csak a riportot."
3. Elküldi a teljes kontextust az OpenAI API-nak (ezúttal nem streaming módban).
4. Visszaküldi a teljes, Markdown formátumú riportot a kliensnek.

A frontend oldalon, `ANALYSIS` állapotban hívd meg ezt az endpontot, és a kapott riportot add át a `ReportDisplay` komponensnek.
```

### Prompt 4.3: PDF Letöltés Implementálása

**Cél:** A riport PDF formátumban való letöltésének lehetővé tétele.

```text
Implementáld a "Letöltés PDF-ként" gomb funkcionalitását a `ReportDisplay` komponensben. Használj egy kliensoldali PDF generáló könyvtárat, mint a `jspdf` és `html2canvas`. A gomb megnyomásakor a `html2canvas` segítségével készíts egy képet a riportot tartalmazó HTML elemről, majd a `jspdf` segítségével illeszd be ezt a képet egy új PDF dokumentumba, és indítsd el a letöltést.
```

---

## 5. Fázis: Befejezés és Finomhangolás

Ez az utolsó fázis a stílusozásra, a reszponzivitásra és a hibakezelésre fókuszál.

### Prompt 5.1: Reszponzív Dizájn

**Cél:** Az alkalmazás reszponzívvá tétele mobil eszközökre.

```text
Menj végig az összes komponensen, és a Tailwind CSS breakpoint direktíváival (`sm:`, `md:`, `lg:`) tedd reszponzívvá a felületet. Biztosítsd, hogy a chat felület és a riport is jól olvasható és használható legyen kisebb képernyőkön is.
```

### Prompt 5.2: Hibakezelés

**Cél:** Robusztus hibakezelés implementálása.

```text
Implementálj hibakezelést mind a frontend, mind a backend oldalon. A backend API hívások legyenek `try...catch` blokkokban. Hiba esetén a backend küldjön egyértelmű hibaüzenetet és státuszkódot. A frontend oldalon jeleníts meg egy felhasználóbarát hibaüzenetet (pl. egy toast notification segítségével), ha az API hívás sikertelen. Kezeld le az OpenAI API hibáit is (pl. API kulcs hiba, túlterheltség).
```


### Prompt 5.3: Validációs Logika

**Cél:** A felhasználói válaszok validálásának implementálása.

```text
Az `implementation_guide.md` "Response Validation" szekciója alapján implementálj validációs logikát a frontend oldalon. Mielőtt a felhasználó üzenetét elküldenéd a backendnek, ellenőrizd, hogy:
- A válasz legalább 10 karakter hosszú (kivéve a numerikus válaszokat, mint a 4. kérdésnél).
- A 4. kérdésnél (data infrastructure rating) a válasz 1 és 5 közötti szám.
Ha a válasz nem felel meg a kritériumoknak, jelenítsd meg egy barátságos figyelmeztetést, és ne küldd el az üzenetet. Adj lehetőséget a felhasználónak, hogy szerkessze a válaszát.
```

### Prompt 5.4: Betöltési Indikátorok és UX Finomhangolás

**Cél:** A felhasználói élmény javítása vizuális visszajelzésekkel.

```text
Adj hozzá betöltési indikátorokat (spinner vagy skeleton screen) minden olyan helyhez, ahol az alkalmazás a backend válaszára vár. Amikor az AI "gépel", jelenítsd meg egy animált "..." indikátort. A riport generálása közben (ANALYSIS állapot) mutass egy professzionális betöltési képernyőt egy üzenettel, mint "Elemzés folyamatban... Személyre szabott ajánlások készítése...". Finomhangold az átmeneteket és animációkat, hogy az alkalmazás simán és professzionálisan működjön.
```

---

## 6. Fázis: Adatbázis Integráció és Perzisztencia (Opcionális)

Ez a fázis opcionális, de ajánlott, ha hosszú távú adattárolásra van szükség.

### Prompt 6.1: PostgreSQL Beállítása

**Cél:** Adatbázis integráció a munkamenetek és riportok tárolásához.

```text
Az `implementation_guide.md` "Database" szekciója alapján integráld a PostgreSQL-t a backend alkalmazásba. Telepítsd a `pg` csomagot. Hozz létre egy `src/db/connection.ts` fájlt, ami kezeli az adatbázis kapcsolatot. Állítsd be a kapcsolati stringet környezeti változóból (`DATABASE_URL`). Hozz létre egy `sessions` táblát a következő mezőkkel:
- `id` (UUID, primary key)
- `company_name` (VARCHAR)
- `messages` (JSONB)
- `readiness_scores` (JSONB)
- `recommendations` (JSONB)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

Írj egy migrációs scriptet, ami létrehozza ezt a táblát.
```

### Prompt 6.2: Munkamenet Perzisztencia

**Cél:** A munkamenetek mentése és betöltése az adatbázisból.

```text
Módosítsd a `/api/chat` és `/api/generate-report` endpontokat, hogy a munkameneteket az adatbázisban tárolják a memória helyett. Amikor egy új munkamenet jön létre, szúrj be egy új rekordot a `sessions` táblába. Minden új üzenet után frissítsd a `messages` mezőt. Amikor a riport elkészül, mentsd el a `readiness_scores` és `recommendations` mezőkbe is. Implementálj egy `GET /api/session/:sessionId` endpontot, ami visszaadja egy adott munkamenet adatait, így a felhasználó később is hozzáférhet a riportjához.
```

---

## 7. Fázis: Telepítés és Éles Környezet

Ez a fázis az alkalmazás telepítésére és éles környezetben való futtatására fókuszál.

### Prompt 7.1: Környezeti Változók Éles Környezethez

**Cél:** Az alkalmazás előkészítése éles telepítésre.

```text
Hozz létre egy `README.md` fájlt a projekt gyökerében, ami tartalmazza:
- Az alkalmazás rövid leírását.
- A telepítési lépéseket (függőségek telepítése, környezeti változók beállítása).
- A fejlesztői környezet indításának lépéseit (`pnpm dev` mindkét csomagban).
- Az éles build készítésének lépéseit.
- Az összes szükséges környezeti változó listáját és leírását.

Módosítsd a backend és frontend `package.json` fájlokat, hogy tartalmazzanak `build` scripteket az éles környezeti buildhez.
```

### Prompt 7.2: Vercel Telepítés (Frontend)

**Cél:** A frontend alkalmazás telepítése Vercel-re.

```text
Készítsd elő a frontend alkalmazást Vercel telepítésre. Hozz létre egy `vercel.json` fájlt a `packages/frontend` mappában, ha szükséges. A `README.md`-be írd bele a Vercel telepítés lépéseit:
1. Csatlakozz a Vercel-hez a GitHub repository-val.
2. Állítsd be a root directory-t `packages/frontend`-re.
3. Állítsd be a build parancsot `pnpm build`-re.
4. Állítsd be a `VITE_API_BASE_URL` környezeti változót az éles backend URL-re.
5. Telepítsd az alkalmazást.
```

### Prompt 7.3: Railway/Render Telepítés (Backend)

**Cél:** A backend alkalmazás telepítése Railway vagy Render szolgáltatásra.

```text
Készítsd elő a backend alkalmazást Railway vagy Render telepítésre. Hozz létre egy `Dockerfile`-t a `packages/backend` mappában, ha szükséges (Railway és Render is támogatja a Dockerfile-alapú telepítést). A `README.md`-be írd bele a telepítés lépéseit:
1. Hozz létre egy új projektet Railway-en vagy Render-en.
2. Csatlakozd a GitHub repository-t.
3. Állítsd be a root directory-t `packages/backend`-re.
4. Állítsd be a build parancsot `pnpm install && pnpm build`-re.
5. Állítsd be a start parancsot `pnpm start`-ra.
6. Állítsd be a környezeti változókat (`OPENAI_API_KEY`, `DATABASE_URL` ha van).
7. Telepítsd az alkalmazást és jegyezd fel az éles URL-t.
```

---

## 8. Fázis: Tesztelés és Optimalizálás

Ez a fázis a minőségbiztosítást és az optimalizálást fedi le.

### Prompt 8.1: Alapvető Tesztek Írása

**Cél:** Egységtesztek és integrációs tesztek létrehozása.

```text
Telepítsd a `vitest` csomagot mind a frontend, mind a backend projektbe. Hozz létre egy `src/__tests__` mappát mindkét projektben. Írj alapvető teszteket:
- Backend: Teszteld az `/api/chat` endpont válaszát egy mock OpenAI klienssel.
- Frontend: Teszteld a `ChatInterface` komponens renderelését és a felhasználói interakciókat (pl. üzenet küldése).

Adj hozzá egy `test` scriptet a `package.json` fájlokhoz, ami futtatja a teszteket.
```

### Prompt 8.2: Teljesítmény Optimalizálás

**Cél:** Az alkalmazás teljesítményének javítása.

```text
Optimalizáld a frontend teljesítményét a következő módokon:
- Implementálj lazy loading-ot a `ReportDisplay` komponensre (`React.lazy`).
- Használj `React.memo`-t a gyakran újrarenderelődő komponenseknél.
- A backend oldalon implementálj rate limiting-et az API endpontokon (használd az `express-rate-limit` csomagot) a túlzott használat megelőzésére.
- Adj hozzá cache-elést az OpenAI válaszokhoz, ha ugyanaz a kérdés-válasz pár többször előfordul (opcionális, haladó).
```

### Prompt 8.3: Biztonsági Audit

**Cél:** Az alkalmazás biztonsági réseinek azonosítása és javítása.

```text
Végezz egy alapvető biztonsági audit-ot:
- Ellenőrizd, hogy az API kulcsok soha ne kerüljenek a frontend kódba vagy a verziókezelésbe.
- Implementálj HTTPS-t éles környezetben (a Vercel és Railway/Render alapértelmezetten támogatja).
- Adj hozzá input sanitization-t a backend endpontokon (használd az `express-validator` csomagot).
- Implementálj CORS-t megfelelően, hogy csak az engedélyezett origin-ek férjenek hozzá az API-hoz.
- Adj hozzá helmet middleware-t a backend-hez a biztonsági headerek beállításához.
```

---

## 9. Fázis: Haladó Funkciók (Opcionális Bővítések)

Ezek a promptok opcionális funkciókat adnak hozzá, amelyek tovább javítják az alkalmazást.

### Prompt 9.1: Email Küldés Funkcionalitás

**Cél:** A riport email-ben való elküldésének lehetősége.

```text
Az `implementation_guide.md` "Report Delivery" szekciója alapján implementálj email küldési funkciót. Telepítsd a `nodemailer` csomagot a backend-en. Hozz létre egy `POST /api/send-report` endpontot, ami fogadja a riportot és egy email címet, majd elküldi a riportot az adott címre. A frontend oldalon a `ReportDisplay` komponensben adj hozzá egy "Küldés emailben" gombot, ami megnyit egy modal-t, ahol a felhasználó megadhatja az email címét.
```

### Prompt 9.2: Többnyelvű Támogatás

**Cél:** Az alkalmazás több nyelven való elérhetősége.

```text
Implementálj többnyelvű támogatást a frontend oldalon. Használd a `react-i18next` könyvtárat. Hozz létre fordítási fájlokat angol és magyar nyelvekre. A felhasználó választhasson a nyelvek között egy dropdown menü segítségével. A backend oldalon a rendszer-promptot is dinamikusan kell betölteni a választott nyelv alapján (ehhez több nyelvű verziókat kell készíteni a `prompt_package.md`-ből).
```

### Prompt 9.3: Admin Dashboard

**Cél:** Egy admin felület létrehozása az összes munkamenet és riport megtekintésére.

```text
Hozz létre egy új route-ot a frontend-en: `/admin`. Ez egy védett oldal legyen, ami egy egyszerű jelszavas autentikációt igényel. Az admin dashboard-on jelenítsd meg az összes mentett munkamenetet egy táblázatban (cég név, létrehozás dátuma, állapot). Kattintásra lehessen megtekinteni az adott munkamenet részleteit és a generált riportot. A backend oldalon hozz létre egy `GET /api/sessions` endpontot, ami visszaadja az összes munkamenetet (autentikációval védve).
```

### Prompt 9.4: Analitika és Betekintések

**Cél:** Aggregált adatok és trendek megjelenítése az értékelésekből.

```text
Az `implementation_guide.md` "Analytics and Insights" szekciója alapján implementálj egy analitika funkciót. Hozz létre egy `GET /api/analytics` endpontot, ami aggregált statisztikákat ad vissza:
- Átlagos readiness score-ok az 5 dimenzióban.
- Leggyakrabban ajánlott AI megoldás kategóriák.
- Iparágak szerinti bontás (ha a felhasználók megadták).

A frontend admin dashboard-ján jelenítsd meg ezeket az adatokat diagramok formájában (használd a `recharts` vagy `chart.js` könyvtárat).
```

---

## 10. Fázis: Dokumentáció és Karbantartás

Az utolsó fázis a projekt dokumentációjának finalizálására és a hosszú távú karbantarthatóság biztosítására fókuszál.

### Prompt 10.1: API Dokumentáció

**Cél:** Teljes API dokumentáció készítése.

```text
Hozz létre egy `API.md` fájlt a projekt gyökerében, ami dokumentálja az összes backend API endpontot. Minden endpont esetében add meg:
- Az URL-t és a HTTP metódust.
- A request body struktúráját (példával).
- A response struktúráját (példával).
- A lehetséges hibakódokat és hibaüzeneteket.
- Példa curl parancsokat a teszteléshez.

Használj táblázatokat és kódblokokat az olvashatóság érdekében.
```

### Prompt 10.2: Fejlesztői Útmutató

**Cél:** Egy részletes útmutató készítése a jövőbeli fejlesztők számára.

```text
Bővítsd a `README.md` fájlt egy "Fejlesztői Útmutató" szekcióval, ami tartalmazza:
- A projekt architektúrájának áttekintését (frontend, backend, adatbázis).
- A mappaszerkezet magyarázatát.
- A kódbázis főbb komponenseinek és moduljainak leírását.
- Útmutatást új funkciók hozzáadásához (pl. új kérdés hozzáadása, új AI megoldás kategória).
- Troubleshooting tippeket gyakori problémákhoz.
```

### Prompt 10.3: CI/CD Pipeline

**Cél:** Automatizált build és telepítési folyamat beállítása.

```text
Hozz létre egy GitHub Actions workflow-t (`.github/workflows/ci.yml` fájl), ami a következőket teszi:
- Minden push és pull request esetén futtatja a teszteket mind a frontend, mind a backend projekten.
- Ha a tesztek sikeresek, és a push a `main` branch-re történik, automatikusan telepíti a frontend-et Vercel-re és a backend-et Railway/Render-re.

A workflow-ban használj environment secreteket az API kulcsok és telepítési tokenek tárolására.
```

---

## Összefoglalás és Következő Lépések

Ezzel a 10 fázissal és a benne található promptokkal egy teljes, működőképes AI Pilot Projekt Értékelő Eszközt építhetsz fel a Cursor segítségével. A promptok sorrendje logikus fejlesztési útvonalat követ, de természetesen testreszabhatod a saját igényeid szerint.

### Ajánlott Munkafolyamat

1. **Kezdd az 1-3. fázissal:** Ezek az alapvető struktúrát és a core funkcionalitást hozzák létre. Ez lesz az MVP (Minimum Viable Product).

2. **Teszteld az MVP-t:** Mielőtt továbblépnél, alaposan teszteld a chat felületet és a riport generálást. Győződj meg róla, hogy az OpenAI integráció megfelelően működik.

3. **Folytasd a 4-5. fázissal:** Ezek finomhangolják a felhasználói élményt és hozzáadják a hiányzó funkciókat (PDF letöltés, hibakezelés).

4. **Opcionális fázisok (6-9):** Ezeket csak akkor implementáld, ha szükséged van rájuk. Az adatbázis integráció (6. fázis) erősen ajánlott, ha hosszú távú adattárolást szeretnél. A haladó funkciók (9. fázis) tovább növelik az alkalmazás értékét.

5. **Finalizálás (10. fázis):** Ne hagyd ki a dokumentációt és a CI/CD beállítást, ezek elengedhetetlenek a hosszú távú karbantarthatósághoz.

### Tippek a Cursor Használatához

- **Kontextus megosztása:** Mindig győződj meg róla, hogy a Cursor látja az összes releváns `.md` fájlt. Ha egy prompt nem ad megfelelő eredményt, próbáld meg újrafogalmazni, és hivatkozz konkrét dokumentumokra vagy szekciókra.

- **Iteratív fejlesztés:** Ne várj tökéletes kódot az első próbálkozásra. A Cursor-ral iteratívan dolgozz: kérd meg, hogy generáljon kódot, teszteld, majd kérd meg, hogy javítsa vagy bővítse.

- **Kód review:** Mindig nézd át a Cursor által generált kódot. Bár a Cursor nagyon jó, nem tökéletes, és előfordulhatnak hibák vagy nem optimális megoldások.

- **Dokumentáció olvasása:** Ha a Cursor egy új könyvtárat vagy eszközt használ, nézd meg annak a dokumentációját is, hogy jobban megértsd, hogyan működik.

### További Források

- **OpenAI API Dokumentáció:** [https://platform.openai.com/docs](https://platform.openai.com/docs)
- **React Dokumentáció:** [https://react.dev](https://react.dev)
- **Express Dokumentáció:** [https://expressjs.com](https://expressjs.com)
- **Tailwind CSS Dokumentáció:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Vercel Telepítési Útmutató:** [https://vercel.com/docs](https://vercel.com/docs)
- **Railway Telepítési Útmutató:** [https://docs.railway.app](https://docs.railway.app)

Sok sikert a fejlesztéshez! Ha bármilyen kérdésed van a promptokkal vagy a fejlesztési folyamattal kapcsolatban, ne habozz visszakérdezni.


---

## Kiegészítés: Ügyfél Azonosítás és Adattárolás

### Prompt 1.5: Ügyfél Azonosító Adatok Gyűjtése

**Cél:** Az értékelés megkezdése előtt az ügyfél azonosító adatainak összegyűjtése.

```text
Az `prompt_package.md` "Client Identification and Data Collection" szekciója alapján implementálj egy kezdeti adatgyűjtési lépést a chat felület indításakor, még a 14 kérdés megkezdése előtt. Hozz létre egy `ClientInfoForm.tsx` komponenst a `packages/frontend/src/components` mappában, ami a következő mezőket tartalmazza:
- Cégnév (kötelező)
- Kapcsolattartó neve (kötelező)
- Beosztás/Titulus (kötelező)
- Email cím (kötelező, email validációval)
- Cégméret (opcionális, dropdown: 1-10, 11-50, 51-200, 201-1000, 1000+)

A form alatt jelenítsd meg egy rövid adatvédelmi tájékoztatót: "Az Ön adatait bizalmasan kezeljük, és kizárólag az értékelés elkészítéséhez és az utánkövetéshez használjuk fel. Bármikor kérheti adatainak elérését vagy törlését a [kapcsolat@cegunk.hu] címen."

Miután a felhasználó elküldte az adatokat, tárold el őket a munkamenet állapotában, és csak ezután kezdd el a 14 kérdésből álló értékelést.
```

### Prompt 6.3: Adatbázis Séma Implementálása Ügyfél Adatokkal

**Cél:** A teljes adatbázis séma létrehozása az ügyfél azonosítással és adattárolással.

```text
Az `implementation_guide.md` "Database Schema for Client Data Management" szekciója alapján hozd létre a következő PostgreSQL táblákat:

1. **clients** tábla: Cégek tárolása (id, company_name, company_size, industry, created_at, updated_at)
2. **contacts** tábla: Kapcsolattartók tárolása (id, client_id, full_name, email, role_title, created_at, updated_at)
3. **assessments** tábla: Értékelések tárolása (id, client_id, contact_id, status, started_at, completed_at, current_question, responses JSONB, ai_readiness_level, strategic_intent, score_pain_points, score_data_readiness, score_org_readiness, score_process_maturity, score_strategic_priorities, score_overall, top_priority_category, report_markdown, report_url, created_at, updated_at)
4. **assessment_access_log** tábla: Hozzáférési napló (id, assessment_id, accessed_by, access_type, accessed_at, ip_address)

Hozd létre a szükséges indexeket a teljesítmény optimalizálásához. Írj migrációs scripteket, amelyek létrehozzák ezeket a táblákat a megfelelő kapcsolatokkal (foreign key constraints).
```

### Prompt 6.4: Backend API Bővítése Ügyfél Adatkezeléssel

**Cél:** A backend API-k módosítása, hogy kezeljék az ügyfél adatokat.

```text
Módosítsd a backend API endpontokat az ügyfél adatok kezelésére:

1. **POST /api/assessment/start**: Új endpont, ami fogadja az ügyfél azonosító adatait (company_name, contact_name, role, email, company_size), létrehoz egy új rekordot a `clients` és `contacts` táblákban (vagy frissíti, ha már létezik), létrehoz egy új `assessments` rekordot `in_progress` státusszal, és visszaadja a `sessionId`-t.

2. Módosítsd a **POST /api/chat** endpontot, hogy minden válasz után frissítse az `assessments` táblában a `responses` JSONB mezőt és a `current_question` értéket.

3. Módosítsd a **POST /api/generate-report** endpontot, hogy a riport elkészülte után frissítse az `assessments` táblában a következő mezőket:
   - `status` = 'completed'
   - `completed_at` = aktuális timestamp
   - `ai_readiness_level`, `strategic_intent`
   - Minden `score_*` mező
   - `report_markdown`
   - `top_priority_category`

4. **GET /api/assessment/:sessionId**: Új endpont, ami visszaadja egy adott értékelés teljes adatait (ügyfél adatokkal együtt).

5. **GET /api/assessments**: Új endpont (admin), ami visszaadja az összes értékelést szűrési lehetőségekkel (dátum, státusz, strategic intent, stb.).
```

### Prompt 9.5: Admin Dashboard Bővítése Ügyfél Adatokkal

**Cél:** Az admin dashboard bővítése, hogy megjelenítse az ügyfél azonosító adatokat.

```text
Bővítsd az admin dashboard-ot (`/admin` route) a következő funkciókkal:

1. **Értékelések Lista**: Jelenítsd meg egy táblázatban az összes értékelést a következő oszlopokkal:
   - Cégnév
   - Kapcsolattartó neve
   - Email
   - Beosztás
   - Strategic Intent
   - Overall Score
   - Státusz (In Progress / Completed / Abandoned)
   - Befejezés dátuma
   - Műveletek (Megtekintés / Riport letöltése)

2. **Szűrési Lehetőségek**: Adj hozzá szűrőket cégnév, strategic intent, dátumtartomány és overall score alapján.

3. **Részletes Nézet**: Kattintásra nyíljon meg egy modal vagy új oldal, ami megjeleníti:
   - Teljes ügyfél adatok
   - Minden kérdés-válasz pár
   - Readiness scores minden dimenzióban
   - Teljes generált riport

4. **Export Funkció**: Adj hozzá egy "Export CSV" gombot, ami exportálja a szűrt értékelések listáját.

5. **GDPR Funkciók**: Adj hozzá egy "Adatok törlése" gombot minden értékelésnél, ami törli az ügyfél összes adatát az adatbázisból (megerősítés után).
```

### Prompt 10.4: GDPR Compliance Implementálása

**Cél:** GDPR megfelelőségi funkciók implementálása.

```text
Implementálj GDPR megfelelőségi funkciókat:

1. **Adatvédelmi Tájékoztató Oldal**: Hozz létre egy `/privacy` route-ot, ami részletesen leírja, hogyan kezeljük az ügyfelek adatait, milyen célokra használjuk, mennyi ideig tároljuk, és milyen jogaik vannak.

2. **Adathozzáférési Kérés**: Hozz létre egy `/data-request` oldalt, ahol az ügyfelek email címük megadásával kérhetik az összes róluk tárolt adat exportálását. Ez egy emailt küld az adminnak, aki manuálisan elküldi az adatokat.

3. **Adattörlési Kérés**: Ugyanezen az oldalon legyen lehetőség adattörlés kérésére is.

4. **Hozzáférési Napló**: Minden alkalommal, amikor egy admin megtekint egy értékelést, írj egy rekordot az `assessment_access_log` táblába (assessment_id, accessed_by, access_type='view', accessed_at, ip_address).

5. **Adatmegőrzési Policy**: Implementálj egy scheduled job-ot (cron), ami havonta egyszer ellenőrzi, hogy vannak-e 36 hónapnál régebbi értékelések, és automatikusan archiválja vagy törli őket (konfigurálható).
```


---

## 11. Fázis: Freemium Modell Implementálása

### Prompt 11.1: Adatbázis Séma Freemium Funkcióhoz

**Cél:** Adatbázis séma frissítése a freemium modell támogatásához.

```text
Frissítsd az adatbázis sémát a freemium modell támogatásához. Add hozzá a következő oszlopokat az `assessments` táblához:
- `report_tier` ENUM('free', 'pro') DEFAULT 'free'
- `upgraded_at` TIMESTAMP NULL
- `payment_id` VARCHAR(255) NULL
- `payment_amount` DECIMAL(10,2) NULL
- `payment_status` ENUM('pending', 'completed', 'failed', 'refunded') NULL

Hozz létre egy új `payments` táblát a következő oszlopokkal:
- `id` UUID PRIMARY KEY
- `assessment_id` UUID FOREIGN KEY → assessments.id
- `stripe_payment_intent_id` VARCHAR(255) UNIQUE
- `amount` DECIMAL(10,2) NOT NULL
- `currency` VARCHAR(3) DEFAULT 'USD'
- `status` ENUM('pending', 'succeeded', 'failed', 'refunded') NOT NULL
- `created_at` TIMESTAMP NOT NULL
- `updated_at` TIMESTAMP NOT NULL

Írj migrációs scriptet ezekhez a változtatásokhoz.
```

### Prompt 11.2: Stripe Integráció - Backend

**Cél:** Stripe fizetési integráció implementálása a backenden.

```text
Implementálj Stripe fizetési integrációt a backenden. Telepítsd a `stripe` npm csomagot, és hozd létre a következő endpointokat:

1. **POST /api/assessment/:sessionId/upgrade**
   - Ellenőrizd, hogy az értékelés létezik és befejezett
   - Ellenőrizd, hogy még nem lett frissítve (report_tier = 'free')
   - Hozz létre egy Stripe PaymentIntent-et $199 értékben
   - Mentsd el a payment rekordot a `payments` táblába 'pending' státusszal
   - Térj vissza a clientSecret-tel

2. **POST /api/webhook/stripe**
   - Ellenőrizd a Stripe webhook signature-t
   - Kezeld a `payment_intent.succeeded` eseményt: frissítsd a `payments` és `assessments` táblákat
   - Kezeld a `payment_intent.payment_failed` eseményt: frissítsd a státuszt 'failed'-re

Használd a környezeti változókat: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, PRO_REPORT_PRICE_USD.
```

### Prompt 11.3: Riport Tier Szűrési Logika - Backend

**Cél:** Riport szintű szűrés implementálása a backenden.

```text
Módosítsd a **GET /api/assessment/:sessionId** endpontot, hogy figyelembe vegye a `report_tier` mezőt:

1. Kérd le az assessment rekordot az adatbázisból
2. Ha `report_tier` = 'free':
   - Parsold a `report_markdown` mezőt
   - Tartsd meg az Executive Summary-t és a Readiness Scorecard-ot
   - A Top Priority Project-ből csak a címet és az első mondatot küldd vissza
   - Távolítsd el a Secondary és Exploratory projekteket
   - Adj hozzá egy `canUpgrade: true` flag-et
3. Ha `report_tier` = 'pro':
   - Küldd vissza a teljes riportot
   - Adj hozzá egy `canUpgrade: false` flag-et

Implementálj egy segédfüggvényt: `filterReportByTier(reportMarkdown, tier)` ami ezt a logikát kezeli.
```

### Prompt 11.4: Ingyenes Riport Nézet - Frontend

**Cél:** Ingyenes riport nézet komponens létrehozása.

```text
Hozz létre egy `FreeReportView.tsx` komponenst a `packages/frontend/src/components` mappában. Ez a komponens jeleníti meg az ingyenes riportot a következő elemekkel:

1. **Executive Summary szekció** - Teljes szöveg megjelenítése
2. **Readiness Scorecard szekció** - Teljes táblázat megjelenítése
3. **Top Priority Project kártya**:
   - Nagy, félkövér cím
   - Egy mondatos összefoglaló
   - Egy "blur" effekttel ellátott terület, ahol a teljes részletek lennének, rajta egy "🔒 Locked" ikon
   - "Unlock Full Details" gomb
4. **Upgrade CTA kártya** (prominens, színes háttérrel):
   - Cím: "Unlock Your Complete Implementation Plan"
   - Lista a Pro Report előnyeiről (bullet points)
   - Ár: "$199 one-time payment"
   - Nagy, elsődleges "Upgrade to Pro Report" gomb, ami megnyitja az UpgradeModal-t

Használj Tailwind CSS-t a stílusozáshoz. A "blur" effekt legyen vizuálisan vonzó, de ne legyen olvasható a szöveg.
```

### Prompt 11.5: Pro Riport Nézet - Frontend

**Cél:** Pro riport nézet komponens létrehozása.

```text
Hozz létre egy `ProReportView.tsx` komponenst a `packages/frontend/src/components` mappában. Ez a komponens jeleníti meg a teljes, Pro szintű riportot:

1. **Executive Summary szekció**
2. **Readiness Scorecard szekció**
3. **Top Priority Project** - Teljes részletekkel (Business Impact + Implementation Approach)
4. **Secondary Priority Project** - Teljes részletekkel
5. **Exploratory Priority Project** - Teljes részletekkel
6. **Action Buttons**:
   - "Download PDF" gomb (hívja a GET /api/assessment/:sessionId/pdf endpontot)
   - "Schedule Consultation" gomb (link egy Calendly vagy hasonló booking oldalra)

Használj Tailwind CSS-t. A megjelenés legyen professzionális és jól olvasható.
```

### Prompt 11.6: Fizetési Modal Stripe Elements-szel

**Cél:** Fizetési modal létrehozása Stripe Elements használatával.

```text
Hozz létre egy `UpgradeModal.tsx` komponenst a `packages/frontend/src/components` mappában. Telepítsd a `@stripe/stripe-js` és `@stripe/react-stripe-js` csomagokat. A modal a következőket tartalmazza:

1. **Modal header**: "Upgrade to Pro Report"
2. **Order summary**:
   - "Pro Report - Complete Implementation Plan"
   - Ár: "$199.00"
3. **Stripe CardElement** a bankkártya adatok beviteléhez
4. **"Complete Payment" gomb**:
   - Kattintásra hívja a POST /api/assessment/:sessionId/upgrade endpontot
   - Használja a visszakapott clientSecret-et a Stripe confirmCardPayment híváshoz
   - Loading állapot megjelenítése a fizetés során
5. **Success/Error üzenetek**:
   - Sikeres fizetés esetén: "Payment successful! Reloading your Pro Report..."
   - Hiba esetén: "Payment failed. Please try again."

A modal bezáródjon sikeres fizetés után, és a riport automatikusan frissüljön a Pro verzióra.
```

### Prompt 11.7: Riport Megjelenítési Logika Frissítése

**Cél:** Riport megjelenítési logika frissítése a tier alapján.

```text
Módosítsd a `ReportDisplay.tsx` komponenst (vagy hozd létre, ha még nem létezik), hogy dinamikusan jelenítse meg a megfelelő riport nézetet a `report_tier` alapján:

1. Kérd le az assessment adatokat a GET /api/assessment/:sessionId endpointról
2. Ellenőrizd a `canUpgrade` flag-et a válaszban
3. Ha `canUpgrade === true`:
   - Rendereld a `FreeReportView` komponenst
   - Add át a `reportData` és `onUpgrade` callback-et
4. Ha `canUpgrade === false`:
   - Rendereld a `ProReportView` komponenst
   - Add át a teljes `reportData`-t

Az `onUpgrade` callback nyissa meg az `UpgradeModal` komponenst.
```

### Prompt 11.8: Prompt Package Frissítése Tier-Aware Generáláshoz

**Cél:** A prompt package frissítése, hogy a riport generálás figyelembe vegye a tier-t.

```text
Módosítsd a backend riport generálási logikát, hogy a rendszer prompt tartalmazza a tier információt. Amikor a POST /api/generate-report endpont hívódik:

1. Alapértelmezetten minden riportot 'free' tier-ként generálj
2. A rendszer prompt végére add hozzá a következő instrukciót:

"IMPORTANT: Generate this report for the FREE TIER. This means:
- Include the full Executive Summary
- Include the full Readiness Assessment Scorecard
- For the Top Priority Project, include ONLY the title and a single-sentence summary (max 25 words)
- DO NOT include the Business Impact or Implementation Approach sections
- DO NOT include Secondary Priority or Exploratory Priority projects
- End with: '---\n\n**Want the complete implementation plan?** Upgrade to our Pro Report to unlock full details for all three priority projects, including business impact analysis, implementation steps, and budget estimates.'"

3. Amikor egy felhasználó fizet és frissít Pro-ra, NEM kell újragenerálni a riportot. Ehelyett tárold el a TELJES riportot a `report_markdown` mezőben már az első generáláskor, és a backend szűrje a tier alapján.

Tehát: mindig generálj TELJES riportot, de a GET endpoint szűrje a tartalmat a tier alapján.
```

### Prompt 11.9: PDF Generálási Szolgáltatás

**Cél:** PDF generálási szolgáltatás implementálása Pro tier-hez.

```text
Implementálj egy PDF generálási szolgáltatást a Pro riportokhoz. Telepítsd a `puppeteer` vagy `@react-pdf/renderer` csomagot. Hozz létre egy új endpontot:

**GET /api/assessment/:sessionId/pdf**

Logika:
1. Ellenőrizd, hogy az assessment `report_tier` = 'pro'. Ha nem, térj vissza 403 Forbidden hibával.
2. Kérd le a teljes `report_markdown` mezőt az adatbázisból
3. Konvertáld a Markdown-t HTML-re (használd a `marked` vagy `markdown-it` csomagot)
4. Generálj egy PDF-et a HTML-ből (használj Puppeteer-t vagy hasonló könyvtárat)
5. Add hozzá a cég logóját és branding-et a PDF header-hez
6. Térj vissza a PDF fájllal, megfelelő Content-Type és Content-Disposition headerekkel:
   - Content-Type: application/pdf
   - Content-Disposition: attachment; filename="AI_Pilot_Assessment_Report_[CompanyName].pdf"

Használj egy HTML template-et a PDF-hez, ami professzionális formázást biztosít.
```

### Prompt 11.10: Környezeti Változók Konfigurálása

**Cél:** Környezeti változók beállítása és dokumentálása.

```text
Hozz létre vagy frissítsd a `.env.example` fájlt a következő környezeti változókkal:

```
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Pricing Configuration
PRO_REPORT_PRICE_USD=199.00
PRO_REPORT_STRIPE_PRICE_ID=price_xxxxxxxxxxxxx

# Feature Flags
ENABLE_FREEMIUM=true
```

Dokumentáld a README.md fájlban, hogyan kell ezeket a változókat beállítani:
1. Stripe account létrehozása
2. API kulcsok megszerzése
3. Webhook endpoint beállítása a Stripe dashboardon
4. Webhook secret megszerzése
5. Price ID létrehozása a Stripe-ban egy $199-os one-time payment-hez
```

### Prompt 11.11: Tesztelés és Minőségbiztosítás

**Cél:** Tesztelési útmutató a freemium funkcióhoz.

```text
Hozz létre egy tesztelési checklist-et a freemium funkció ellenőrzéséhez:

1. **Free Tier Flow**:
   - [ ] Felhasználó kitölti az értékelést
   - [ ] Free riport megjelenik a megfelelő tartalommal (Executive Summary, Scorecard, Top Priority title only)
   - [ ] Upgrade CTA látható és kattintható
   - [ ] Secondary és Exploratory projektek NEM láthatók

2. **Payment Flow**:
   - [ ] Upgrade gomb megnyitja az UpgradeModal-t
   - [ ] Stripe CardElement betöltődik
   - [ ] Teszt kártyával (4242 4242 4242 4242) sikeres fizetés
   - [ ] Webhook event megérkezik és frissíti az adatbázist
   - [ ] Riport automatikusan frissül Pro verzióra

3. **Pro Tier Flow**:
   - [ ] Teljes riport megjelenik (mind a 3 projekt teljes részletekkel)
   - [ ] PDF letöltés gomb működik
   - [ ] PDF tartalmazza a teljes riportot
   - [ ] Upgrade CTA NEM látható

4. **Edge Cases**:
   - [ ] Duplikált upgrade kísérlet (már Pro tier) → hiba üzenet
   - [ ] Fizetési hiba kezelése (declined card)
   - [ ] Session lejárat kezelése

Használj Stripe test mode-ot és test kártyákat a teszteléshez.
```
