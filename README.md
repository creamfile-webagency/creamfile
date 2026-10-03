# Creamfile.com

This repository contains the public `creamfile.com` site: an Astro 5 site deployed on Cloudflare Pages with a small Cloudflare Worker endpoint for the contact form. The site is written in TypeScript/Astro, and the public portfolio is driven from one YAML file, `src/data/sites.yaml`, which is validated at build time with Zod.

## Prerequisites

- Node 22. Use `nvm` or another version manager if you have multiple Node versions installed.
- pnpm:

```bash
npm install -g pnpm
```

## Running Locally

```bash
pnpm install
pnpm dev           # http://localhost:4321
pnpm build         # produces dist/
pnpm preview       # preview the built site locally
```

The contact form needs a local `dev.vars` file with `TURNSTILE_SECRET` and `RESEND_API_KEY`. See `credentials/README.md` for where those values live and how to obtain them. Never commit `dev.vars` or files from `credentials/`.

## One-File Portfolio Workflow

The entire portfolio lives in `src/data/sites.yaml`. Editing this file and pushing to `main` automatically rebuilds and deploys the site via Cloudflare Pages.

The order in the YAML file is the order shown on the site. Hidden sites are excluded from public counts and lists, but stay in the file for later.

### Add a New Site

Copy an existing site block under `sites` and change the fields:

```yaml
- domain: nyajt.se
  group: guider
  description: Kort beskrivning av sajten, max 120 tecken.
  languages: [sv]
  status: live
  url: https://nyajt.se
  featured: false
  hidden: false
```

Allowed language values are `sv`, `da`, `no`, `nl`, `en`, and `multi`. For IDN domains, keep `domain` human-readable and put the punycode URL in `url`.

### Move a Site to Another Group

Change the `group` field to the new group id:

```yaml
group: finans
```

Current group ids are `guider`, `finans`, `privatekonomi`, `spel`, `sport`, and `handel`.

### Mark a Site as Under Construction

Change the status:

```yaml
status: building
```

The "Under uppbyggnad" label appears automatically.

### Hide a Site Without Deleting It

Set `hidden: true`:

```yaml
hidden: true
```

The site disappears from all counts and lists but stays in `src/data/sites.yaml`.

### Add a New Group

Add a block under `groups` with `id`, `name`, `intro`, and `tagline`:

```yaml
- id: halsa
  name: Hälsa & träning
  intro: Beskrivning av gruppen.
  tagline: Verktyg och guider för hälsosam livsstil
```

Then add sites that reference the new group:

```yaml
group: halsa
```

### Validation

The build validates all portfolio data with Zod. If you mistype a group id, the build fails with a message like:

```text
Error: sites.yaml: domain "example.se" has unknown group "halssa". Valid groups: guider, finans, ...
```

It also validates required fields, URLs, languages, and the 120-character maximum for descriptions.

## Deployment

The site deploys automatically via Cloudflare Pages when you push to `main`.

Manual deploy, if needed:

```bash
pnpm build
wrangler pages deploy dist/ --project-name=creamfile-com
```

First-time Cloudflare Pages setup:

1. Connect the GitHub repo in Cloudflare Dashboard -> Pages -> Create project.
2. Set build command to `pnpm build`.
3. Set build output directory to `dist`.
4. Set the Worker secrets listed below.

## Worker Secrets

The contact form at `/api/kontakt` requires two secrets set in Cloudflare:

```bash
wrangler secret put TURNSTILE_SECRET
wrangler secret put RESEND_API_KEY
```

For local dev, create `dev.vars` at the repo root. This file is gitignored and must never be committed:

```dotenv
TURNSTILE_SECRET=0x...   # test key from Cloudflare Turnstile Dashboard
RESEND_API_KEY=re_...    # from Resend Dashboard
```

Cloudflare API credentials for deployment are documented in `credentials/README.md` and stored outside git.

## DNS Setup

`creamfile.com` should point to Cloudflare Pages:

- Change nameservers to Cloudflare's, if not already done.
- Add `creamfile.com` as the Pages custom domain. Cloudflare auto-manages the required apex records.
- Add `www` as a custom domain or CNAME it to the Pages target and redirect it to the apex.

`creamfile.se` should 301 redirect to `creamfile.com`. Set up Cloudflare Bulk Redirects, or add equivalent redirects in `public/_redirects`:

```text
/ https://creamfile.com/ 301
/vara-medier/ https://creamfile.com/portfolj 301
/kontakt/ https://creamfile.com/kontakt 301
/* https://creamfile.com/ 301
```

`www.creamfile.com` should resolve to the apex. Cloudflare Pages can handle this when both domains are configured on the same Pages project.

## Email: Resend DKIM/SPF/DMARC Setup

Follow Resend's domain verification for `creamfile.com`:

1. In Resend Dashboard -> Domains -> Add domain -> `creamfile.com`.
2. Add the DNS records Resend shows, including TXT for SPF and CNAME records for DKIM.
3. Add DMARC:

```text
TXT _dmarc.creamfile.com "v=DMARC1; p=quarantine; rua=mailto:dmarc@creamfile.com"
```

4. Verify the domain in the Resend dashboard.

## GitHub Actions

`.github/workflows/deploy.yml` is a CI/CD stub for Cloudflare Pages. To activate it, add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub repository secrets. The values are documented in `credentials/.creamfile.env`, which must not be committed.

## Lighthouse Performance Budget

Before launch, save a Lighthouse report to `docs/lighthouse-report.html`:

```bash
lighthouse https://creamfile.com --output html --output-path docs/lighthouse-report.html
```

Target budget:

- 95 or higher in all four Lighthouse categories on mobile.
- LCP below 1.5s on 4G.
- Total page weight below 300 kB including fonts.
