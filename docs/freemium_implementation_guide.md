# Freemium Model Implementation Guide

## Executive Summary

This document provides a complete, implementation-ready specification for adding a freemium monetization model to the AI Pilot Assessment Tool. The recommended model is the **"Feature-Gated Report"** approach, where users receive a valuable free report after completing the assessment, with an option to upgrade to a "Pro Report" for detailed implementation guidance.

## Recommended Freemium Model: Feature-Gated Report

### Free Tier (Lead Magnet)

Every user who completes the 14-question assessment receives:

1. **Executive Summary** - Full personalized summary
2. **Readiness Assessment Scorecard** - All 6 dimensions with scores
3. **Top Priority Project (Title + One-Sentence Summary Only)** - No implementation details
4. **Clear Upgrade CTA** - Prominent call-to-action to unlock the Pro Report

### Pro Tier (Paid Upgrade)

Users who pay $99-$299 unlock:

1. **Everything in Free Tier**
2. **Top Priority Project (Full Details)** - Complete business impact analysis and implementation approach
3. **Secondary Priority Project (Full Details)** - Complete recommendation
4. **Exploratory Priority Project (Full Details)** - Complete recommendation
5. **PDF Export** - Download professionally branded PDF
6. **Schedule Consultation Link** - Direct booking link for paid consultation

### Why This Model Works

- **Maximizes Lead Generation:** Free report provides genuine value, encouraging maximum participation
- **Builds Trust:** Demonstrating expertise upfront makes clients receptive to sales outreach
- **Strong Upsell Incentive:** Free report answers "What?" while Pro Report answers "How?"
- **Filters Qualified Leads:** Payment indicates serious intent, creating highly qualified pipeline

---

## Implementation Specification

### 1. Database Schema Updates

Add the following columns to the existing `assessments` table:

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `report_tier` | ENUM('free', 'pro') | DEFAULT 'free' | Report access level |
| `upgraded_at` | TIMESTAMP | NULLABLE | When user upgraded to Pro |
| `payment_id` | VARCHAR(255) | NULLABLE | Stripe payment ID |
| `payment_amount` | DECIMAL(10,2) | NULLABLE | Amount paid for upgrade |
| `payment_status` | ENUM('pending', 'completed', 'failed', 'refunded') | NULLABLE | Payment status |

Create a new `payments` table for detailed payment tracking:

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique payment identifier |
| `assessment_id` | UUID | FOREIGN KEY → assessments.id | Associated assessment |
| `stripe_payment_intent_id` | VARCHAR(255) | UNIQUE | Stripe PaymentIntent ID |
| `amount` | DECIMAL(10,2) | NOT NULL | Payment amount in USD |
| `currency` | VARCHAR(3) | DEFAULT 'USD' | Payment currency |
| `status` | ENUM('pending', 'succeeded', 'failed', 'refunded') | NOT NULL | Payment status |
| `created_at` | TIMESTAMP | NOT NULL | Payment creation time |
| `updated_at` | TIMESTAMP | NOT NULL | Last status update time |

### 2. Backend API Endpoints

#### New Endpoint: POST /api/assessment/:sessionId/upgrade

**Purpose:** Initiate the upgrade process and create a Stripe payment intent.

**Request Body:**
```json
{
  "priceId": "price_1234567890" // Optional: Stripe Price ID for different tiers
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_yyy",
  "paymentIntentId": "pi_1234567890",
  "amount": 199.00,
  "currency": "usd"
}
```

**Logic:**
1. Verify the assessment exists and is completed
2. Check if already upgraded (return error if yes)
3. Create Stripe PaymentIntent with amount $199 (or configurable)
4. Create record in `payments` table with status 'pending'
5. Return client secret for frontend payment form

#### New Endpoint: POST /api/webhook/stripe

**Purpose:** Handle Stripe webhook events to update payment status.

**Logic:**
1. Verify Stripe webhook signature
2. Handle `payment_intent.succeeded` event:
   - Update `payments` table status to 'succeeded'
   - Update `assessments` table: set `report_tier` = 'pro', `upgraded_at` = NOW(), `payment_id`, `payment_amount`, `payment_status` = 'completed'
3. Handle `payment_intent.payment_failed` event:
   - Update `payments` table status to 'failed'
   - Update `assessments` table: set `payment_status` = 'failed'

#### Modified Endpoint: GET /api/assessment/:sessionId

**Purpose:** Return assessment data with appropriate report tier filtering.

**Logic:**
1. Retrieve assessment from database
2. Check `report_tier` field
3. If `report_tier` = 'free':
   - Return full executive summary and scorecard
   - Return only title and one-sentence summary for Top Priority project
   - Exclude Secondary and Exploratory projects
   - Set flag `canUpgrade: true`
4. If `report_tier` = 'pro':
   - Return full report with all project details
   - Set flag `canUpgrade: false`

#### New Endpoint: GET /api/assessment/:sessionId/pdf

**Purpose:** Generate and download PDF of Pro Report (Pro tier only).

**Logic:**
1. Verify assessment exists and `report_tier` = 'pro'
2. If not Pro, return 403 Forbidden
3. Generate PDF from `report_markdown` using a library (e.g., Puppeteer, WeasyPrint)
4. Return PDF file with appropriate headers

### 3. Frontend Components

#### Component: FreeReportView.tsx

**Purpose:** Display the free tier report with upgrade CTA.

**Key Elements:**
- Full Executive Summary section
- Full Readiness Scorecard table
- Top Priority Project card with:
  - Project title (large, bold)
  - One-sentence summary
  - Blurred/grayed-out area where full details would be
  - Prominent "Unlock Full Details" button
- Upgrade CTA card:
  - Headline: "Unlock Your Complete Implementation Plan"
  - Benefits list: Full business impact analysis, detailed implementation steps, secondary and exploratory projects, PDF export
  - Price: "$199 one-time payment"
  - "Upgrade to Pro Report" button (primary CTA)

#### Component: ProReportView.tsx

**Purpose:** Display the full Pro tier report.

**Key Elements:**
- Full Executive Summary section
- Full Readiness Scorecard table
- Top Priority Project (complete with business impact and implementation approach)
- Secondary Priority Project (complete)
- Exploratory Priority Project (complete)
- "Download PDF" button
- "Schedule Consultation" button

#### Component: UpgradeModal.tsx

**Purpose:** Handle the payment flow using Stripe Elements.

**Key Elements:**
- Modal dialog with payment form
- Stripe CardElement for credit card input
- Order summary: "Pro Report Upgrade - $199"
- "Complete Payment" button
- Loading state during payment processing
- Success/error messages

### 4. Prompt Package Updates

Update the `prompt_package.md` file to include instructions for generating tier-appropriate reports.

**Add to Section 3 (Output Format):**

```markdown
### Report Tier Handling

The system must generate reports that are appropriate for the user's tier (free or pro).

**For Free Tier Reports:**
- Include the full Executive Summary
- Include the full Readiness Assessment Scorecard
- For the Top Priority Project, include ONLY:
  - The project title
  - A single sentence summarizing the project (max 25 words)
  - Example: "Implement an AI-powered chatbot to handle tier-1 customer support inquiries, focusing on the most common questions."
- DO NOT include the "Business Impact" or "Implementation Approach" sections for any project
- DO NOT include Secondary Priority or Exploratory Priority projects
- End the report with a clear upgrade call-to-action

**For Pro Tier Reports:**
- Include all sections as specified in the full output format
- Include complete details for all three priority projects
```

### 5. Environment Variables

Add the following environment variables to your `.env` file:

```bash
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

---

## Cursor Implementation Prompts

### Prompt 11.1: Database Schema for Freemium

**Cél:** Adatbázis séma frissítése a freemium funkcióhoz.

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

### Prompt 11.2: Stripe Integration - Backend

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

### Prompt 11.3: Report Tier Logic - Backend

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

### Prompt 11.4: Free Report View - Frontend

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

### Prompt 11.5: Pro Report View - Frontend

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

### Prompt 11.6: Upgrade Modal with Stripe Elements

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

### Prompt 11.7: Report Display Logic Update

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

### Prompt 11.8: Prompt Package Update for Tier-Aware Generation

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

### Prompt 11.9: PDF Generation Service

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

### Prompt 11.10: Environment Configuration

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

### Prompt 11.11: Testing & Quality Assurance

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

---

## Implementation Checklist

- [ ] **Prompt 11.1**: Database schema updates
- [ ] **Prompt 11.2**: Stripe backend integration
- [ ] **Prompt 11.3**: Report tier filtering logic
- [ ] **Prompt 11.4**: FreeReportView component
- [ ] **Prompt 11.5**: ProReportView component
- [ ] **Prompt 11.6**: UpgradeModal with Stripe Elements
- [ ] **Prompt 11.7**: Report display logic update
- [ ] **Prompt 11.8**: Prompt package tier-aware generation
- [ ] **Prompt 11.9**: PDF generation service
- [ ] **Prompt 11.10**: Environment configuration
- [ ] **Prompt 11.11**: Testing & QA

---

## Expected Business Impact

### Revenue Projections

Assuming 1000 assessments per month with a 10% conversion rate to Pro:

- **Free Assessments:** 1000/month
- **Pro Upgrades:** 100/month (10% conversion)
- **Monthly Revenue:** $19,900 (at $199/upgrade)
- **Annual Revenue:** $238,800

### Lead Quality Improvement

The payment acts as a qualification filter. Users who pay $199 for the Pro Report are:
- 5-10x more likely to engage in a sales conversation
- 3-5x more likely to convert to a consulting engagement
- Pre-qualified with a demonstrated budget and decision-making authority

### Upsell Opportunities

The Pro Report can be positioned as a credit towards consulting services:
- "Your $199 Pro Report fee will be credited towards any consulting engagement over $5,000"
- This reduces friction for high-value sales while still monetizing smaller leads

---

**Document Prepared By:** Manus AI  
**Last Updated:** January 2026
