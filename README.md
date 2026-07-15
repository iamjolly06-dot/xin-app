# XỊN App — Complete Zero-to-Launch Guide

This folder is your real, working project. Every code change described earlier has
already been made inside `src/App.jsx`, `src/lib/supabase.js`, and `api/`. This
README walks through **every single step** to get it running on your computer,
connected to real services, and live on the internet — nothing skipped.

Do the steps in order. Each one depends on the one before it.

---

## PART 1 — Install the tools on your computer (one-time)

### 1.1 Install Node.js
1. Go to https://nodejs.org
2. Download the **LTS** version for your operating system (Windows/Mac/Linux).
3. Run the installer, click Next/Continue through the defaults, finish.
4. Open your terminal (Mac: "Terminal" app, Windows: "Command Prompt" or "PowerShell") and check it worked:
   ```bash
   node -v
   npm -v
   ```
   You should see version numbers (e.g. `v20.x.x`). If you see "command not found," restart your terminal/computer and try again.

### 1.2 Install a code editor
1. Go to https://code.visualstudio.com
2. Download and install VS Code for your OS.
3. Open VS Code once to confirm it launches.

### 1.3 Install Git
1. Go to https://git-scm.com/downloads
2. Download and install for your OS (defaults are fine).
3. Confirm it worked:
   ```bash
   git --version
   ```

### 1.4 Create your free accounts
Create all four now — you'll need them throughout:
1. **GitHub** — https://github.com/signup
2. **Supabase** — https://supabase.com → "Start your project" → sign in with GitHub
3. **Vercel** — https://vercel.com/signup → sign in with GitHub
4. **Tawk.to** — https://www.tawk.to → "Sign Up Free"
(Stripe account comes later in Part 5, only when you're ready for payments.)

---

## PART 2 — Get the project onto your computer

1. Open this project folder in VS Code: File → Open Folder → select this `xin-app` folder.
2. Open a terminal inside VS Code: Terminal menu → New Terminal.
3. Install all the project's dependencies:
   ```bash
   npm install
   ```
   This will take a minute or two and creates a `node_modules` folder — that's normal, don't touch it.

---

## PART 3 — Set up Supabase (your database)

### 3.1 Create the project
1. Go to https://supabase.com/dashboard
2. Click **New Project**.
3. Pick an organization (or create one), name the project `xin-app`, set a database password (save it somewhere safe), pick the region closest to your customers (e.g. Southeast Asia).
4. Click **Create new project** and wait ~2 minutes for it to finish provisioning.

### 3.2 Create the database tables
1. In the left sidebar, click **SQL Editor**.
2. Click **New query**.
3. Open `supabase-schema.sql` from this project folder, copy its entire contents.
4. Paste into the Supabase SQL editor.
5. **Before running it**, replace both instances of `YOUR_ADMIN_EMAIL@example.com` with the email you'll use to manage the store.
6. Click **Run** (bottom right). You should see "Success. No rows returned."
7. Confirm the tables exist: left sidebar → **Table Editor** → you should see `products` and `orders`.

### 3.3 Create your admin login
1. Left sidebar → **Authentication** → **Users**.
2. Click **Add user** → **Create new user**.
3. Enter the same email you put into the SQL script, set a password, click **Create user**.
4. This email+password is what you'll type into the app's admin login screen later.

### 3.4 Get your API keys
1. Left sidebar → **Project Settings** (gear icon) → **API**.
2. Copy the **Project URL** and the **anon public** key — you'll need both in the next step.

### 3.5 Connect the app to Supabase
1. In VS Code, find the file `.env.example` in the project root.
2. Make a copy of it named exactly `.env` (same folder).
3. Open `.env` and fill in:
   ```
   VITE_SUPABASE_URL=<paste your Project URL>
   VITE_SUPABASE_ANON_KEY=<paste your anon public key>
   ```
4. Save the file.

### 3.6 Add the starter products (optional but recommended)
The app ships with a demo product list built into the code (`DEFAULT_PRODUCTS`) purely
as a fallback so the app never looks empty. To make those real, editable database rows:
1. Go to Supabase → **Table Editor** → `products` → note it's empty right now.
2. Easiest path: run the app locally (Part 4), log into `/adminlogin` with your admin
   account, and use **"Thêm sản phẩm"** to add a few real products by hand, or paste
   real product links using the auto-fetch box. They'll be saved straight to this table.

---

## PART 4 — Run the app on your computer to test it

1. In the VS Code terminal:
   ```bash
   npm run dev
   ```
2. It will print a local address, usually `http://localhost:5173`. Open that in your browser (Cmd/Ctrl+Click the link, or copy-paste it).
3. You should see the XỊN home screen loading products from Supabase (falls back to the demo list if the table is still empty).
4. Click the ⚙️ (Settings) icon in the top right → this opens `/adminlogin`.
5. Log in with the admin email + password you created in step 3.3.
6. Try adding a product, or pasting a product link into "Dán link sản phẩm để tự động điền" and clicking "Lấy dữ liệu" — note this calls `/api/fetch-product`, which **only works once deployed to Vercel** (see Part 6), not in plain `npm run dev`. Locally you'll see an error for that button specifically — that's expected at this stage.
7. Leave this running while you work; press `Ctrl+C` in the terminal when you're done testing.

---

## PART 5 — Live chat (Tawk.to)

1. Go to your Tawk.to dashboard: https://dashboard.tawk.to
2. If prompted, create your first "property" (this represents your website) — name it `XỊN`.
3. Left sidebar → **Administration** → **Chat Widget**.
4. You'll see a **Widget Code** section with a script tag containing two IDs in the URL, like:
   `https://embed.tawk.to/60f.../1abc...`
5. Open `index.html` in this project, find the line:
   ```html
   s1.src = "https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID";
   ```
   Replace it with the exact URL Tawk.to gave you.
6. Save. Once deployed (Part 6), the chat bubble will appear on your live site automatically.
7. Install the **Tawk.to mobile app** (App Store / Play Store) and log in, so you get notified when a customer opens chat — this is where you'll manually send bank transfer details, or PayPal/Wise/Xoom payment links.

---

## PART 6 — Deploy for free with GitHub + Vercel

### 6.1 Push the code to GitHub
1. On GitHub.com, click the **+** icon (top right) → **New repository**.
2. Name it `xin-app`, leave it Public or Private (your choice), **don't** check "Add a README" (you already have one). Click **Create repository**.
3. GitHub shows you commands — back in your VS Code terminal, run these one at a time (replace `YOUR_USERNAME`):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/xin-app.git
   git push -u origin main
   ```
4. Refresh the GitHub page — your files should now appear there. Confirm `.env` is **not** listed (it's protected by `.gitignore` — your secret keys should never be pushed to GitHub).

### 6.2 Import into Vercel
1. Go to https://vercel.com/new
2. Click **Import** next to your `xin-app` GitHub repo (authorize Vercel to access GitHub if asked).
3. Vercel auto-detects it's a Vite project — leave the build settings as default.
4. **Before clicking Deploy**, expand **Environment Variables** and add three rows:
   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | same value as in your `.env` |
   | `VITE_SUPABASE_ANON_KEY` | same value as in your `.env` |
   | `STRIPE_SECRET_KEY` | from Part 7 below (can add this later and redeploy) |
5. Click **Deploy**. Wait ~1–2 minutes.
6. You'll get a live URL like `https://xin-app.vercel.app` — open it. Your app is now live on the internet.

### 6.3 Every future update
Whenever you change code locally:
```bash
git add .
git commit -m "describe your change"
git push
```
Vercel automatically redeploys within about a minute. No dashboard clicking needed.

---

## PART 7 — Payments

### 7.1 Bank transfer via chat (already working)
On the checkout screen, any method other than "Visa / Mastercard" triggers "Đặt hàng &
chat để lấy thông tin thanh toán" — this places the order in your `orders` table and
pops open the Tawk.to chat so you can manually send your bank account details. No setup
needed beyond Part 5.

### 7.2 Card payments + Apple Pay, via Stripe
1. Go to https://dashboard.stripe.com/register and create an account.
2. Complete the business details form (you can start in **Test mode** without full
   verification, and finish verification later before going live).
3. Left sidebar → **Developers** → **API keys**.
4. Copy the **Secret key** (starts with `sk_test_...` in test mode, `sk_live_...` once verified).
5. Go back to Vercel → your project → **Settings** → **Environment Variables** → add/edit
   `STRIPE_SECRET_KEY` with that value → **Save**.
6. Go to **Deployments** tab → click the ⋯ menu on the latest deployment → **Redeploy**
   (environment variable changes need a redeploy to take effect).
7. Apple Pay works automatically through Stripe Checkout once your Stripe account is
   verified and you're on a real `https://` domain (Vercel gives you this by default) —
   no separate Apple setup needed for a basic Stripe Checkout flow.
8. Test it: on your live site, add something to cart → checkout → choose "Visa /
   Mastercard" → click "Thanh toán bằng thẻ / Apple Pay." In test mode, use Stripe's
   test card `4242 4242 4242 4242`, any future expiry date, any CVC.

### 7.3 PayPal, Wise, Xoom
These don't have a simple embeddable "buy button" that fits this app's flow the way
Stripe does. The practical approach:
- **PayPal**: create a PayPal.me link (paypal.me/yourusername) or a PayPal Business
  "Request Money" link, and paste it into Tawk.to chat when a customer asks for it.
- **Wise**: create a Wise "payment request" link from your Wise account and share it the same way.
- **Xoom**: share your Xoom-linked PayPal email/account details via chat; Xoom is
  typically used for remittances rather than an embeddable storefront checkout.

This keeps things simple now; if volume grows, PayPal does have a JS SDK "Buy Now"
button you can add later the same way Stripe was added above.

---

## PART 8 — Make it installable ("downloadable") on phones

The PWA files are already in place (`public/manifest.json`, `public/sw.js`, and the
registration script in `index.html`). Two things left:

1. **Add real icons**: create two square PNG images — `icon-192.png` (192×192px) and
   `icon-512.png` (512×512px) — your logo/wordmark works well here. Place both directly
   in the `public/` folder, replacing nothing (they don't exist yet — you're adding
   them). Commit and push (Part 6.3) to deploy them.
2. **Test installing it**:
   - **Android/Chrome**: visit your live Vercel URL → you'll see an "Install app" icon
     in the address bar, or a banner prompt. Tap it.
   - **iPhone/Safari**: visit your live Vercel URL → tap the Share icon → **Add to Home
     Screen** → Add. It now opens full-screen with its own icon, like a native app —
     no App Store needed.

If you later want a real listing in the **Apple App Store** or **Google Play Store**
(optional, not required to "publish" the app), wrap this same codebase with
[Capacitor](https://capacitorjs.com/docs/getting-started) — that requires a $99/year
Apple Developer account and a $25 one-time Google Play developer fee, plus each
store's review process. Treat this as a later phase, not a launch blocker.

---

## Quick troubleshooting

- **Products not showing**: check your `.env` (local) or Vercel env vars (live) have
  the correct Supabase URL/key, and that `supabase-schema.sql` ran successfully.
- **Admin login fails**: confirm the email/password matches exactly what you created
  in Supabase → Authentication → Users, and that the email matches what's in your RLS
  policies in `supabase-schema.sql`.
- **Link auto-fetch does nothing locally**: expected — `/api/*` functions only run on
  Vercel, not in `npm run dev`. Test that feature on your live deployed URL.
- **Chat bubble missing**: double check the Tawk.to script URL in `index.html` has your
  real property/widget IDs, not the placeholder text.
- **Stripe button does nothing**: confirm `STRIPE_SECRET_KEY` is set in Vercel and you
  redeployed after adding it.

---

## Recap: the order to actually do this in

1. Part 1 — install tools, create accounts
2. Part 2 — `npm install`
3. Part 3 — Supabase project, tables, admin user, `.env`
4. Part 4 — run locally, confirm it works
5. Part 6.1–6.2 — push to GitHub, deploy to Vercel (do this early so `/api` routes work)
6. Part 5 — Tawk.to chat
7. Part 7 — Stripe (+ note on PayPal/Wise/Xoom)
8. Part 8 — icons + install test
