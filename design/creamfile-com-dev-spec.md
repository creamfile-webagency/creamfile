# creamfile.com — Utvecklingsspec

*Rev. 1, 2026-10-03. Beställare: Ben (Creamfile AB). Underlag: `creamfile-varumarkesplattform.md`, `creamfile-visuell-identitet.md`, `creamfile-portfoljstrategi.md`, `creamfile-com-designforslag.html` (öppna i webbläsare), `creamfile-logotyp/` och `sites.yaml` — alla i samma mapp.*

---

## 1. Vad som ska byggas

En ny företagssajt för Creamfile AB på creamfile.com som ersätter creamfile.se. Fem sidor på svenska, riktade till annonsörer och B2B-kunder: startsida, portfölj, annonsera, om Creamfile, kontakt. Sajten är helt statisk med ett kontaktformulär som enda serverfunktion.

Det viktigaste kravet efter design: **portföljen ska kunna uppdateras utan att röra kod.** Alla sajter, grupper och beskrivningar ligger i en datafil (`src/data/sites.yaml`), och startsida, portföljsida, sidfot och sajtkarta genereras ur den. Att lägga till en sajt, flytta den till en annan grupp eller markera den "under uppbyggnad" ska vara en redigering av den filen och en push.

## 2. Stack och hosting

**Astro** (senaste 5.x) med statisk output, **TypeScript**, ingen UI-ramverkskod (inga React/Vue-öar behövs). Hostas på **Cloudflare** som Worker med statiska assets (`@astrojs/cloudflare`-adaptern i static-läge, eller Cloudflare Pages om teamet föredrar det — båda är gratis på den här trafiknivån; Worker-vägen är den Cloudflare rekommenderar framåt och den elen.se migrerar till). Deploy via GitHub-koppling: push till `main` bygger och publicerar; pull requests får preview-URL.

Varför inte WordPress: sajten har fem sidor och en datafil, ingen redaktion, inga inloggade användare. Astro ger snabbare sidor, inga uppdateringar att sköta, ingen attackyta, och samma stack som elen.se och PFG-sajterna så att teamet redan kan den. Varför inget headless CMS: en YAML-fil i GitHub är enklare för en person att underhålla än ett CMS-konto, och versionshistoriken följer med gratis. Om Ben senare vill redigera i ett formulär kan Keystatic eller Decap kopplas på samma fil utan att bygga om något.

Kontaktformuläret körs som en **Cloudflare Worker-route** (`/api/kontakt`) som validerar, kontrollerar **Turnstile** och skickar mail via **Resend** till `info@creamfile.com`. Inga databaser, inga konton.

Repo: `creamfile-com` i Creamfiles GitHub. Node 22, pnpm.

## 3. Struktur

```
src/
  data/sites.yaml            # hela portföljen (se bilaga A) — den enda filen som ändras i vardagen
  data/site.ts               # bolagsuppgifter: namn, org.nr, adress, mail, sociala länkar
  content/                   # inte behövd i v1 (ingen blogg)
  layouts/Base.astro         # <head>, header, footer, skip-link
  components/
    Header.astro  Footer.astro  Button.astro  Label.astro
    DomainName.astro         # renderar "restaurang.com" med punkten i accentfärg
    SiteCard.astro           # kort på portföljsidan
    DomainList.astro         # kompakt lista på startsidan
    GroupSection.astro       # en grupp = rubrik + intro + kort/lista
    StatRow.astro            # bevisraden (antal sajter räknas ur sites.yaml)
    OfferCard.astro          # de fyra erbjudandena på /annonsera
    ContactForm.astro        # formulär + Turnstile-widget
  pages/
    index.astro  portfolj.astro  annonsera.astro  om.astro  kontakt.astro
    integritetspolicy.astro  404.astro
    api/kontakt.ts           # Worker-route (POST)
  styles/tokens.css          # designtokens, se §5
  styles/global.css
public/
  logo/*.svg  favicon.svg  favicon.ico  og-default.png  robots.txt
```

`sites.yaml` läses via Astro Content Collections (`defineCollection` med Zod-schema, se bilaga A) så att ett stavfel i `group` eller `status` stoppar bygget med ett tydligt fel i stället för att tyst försvinna från sajten.

## 4. Sidor

Alla sidor följer designförslaget artboard för artboard. Copy nedan är slutlig där den är citerad; hakparenteser är uppgifter Ben fyller i i `site.ts` eller direkt i filen.

**Startsida `/`.** Header (logotyp, Portfölj, Annonsera, Om Creamfile, Kontakt, knapp "Kontakta oss"). Hero med etikett "Creamfile AB", H1 "Sveriges självklara adresser.", ingress som nämner de sajter som har `featured: true` i datafilen ("Vi äger och bygger restaurang.com, hotellet.se, bröllop.se, elen.se, aktie.se och ett fyrtiotal andra sajter på de adresser människor i Sverige och Norden söker sig till först. Vill du synas där dina kunder redan letar?"), två knappar (primär "Annonsera hos oss" → /annonsera, sekundär "Se portföljen" → /portfolj), bevisrad med tre tal: antal sajter (räknat ur datafilen, exkl. `hidden`), antal grupper (räknat), "2004" med etikett "sedan". Mörk portföljsektion (Bläck) med etikett "Portföljen", H2 "Den som äger ordet äger kategorin.", en rad per grupp med gruppnamn, antal och domänlista, knapp "Hela portföljen" (Honung). Annonsörssektion: etikett "För annonsörer", H2 "Gräddfilen till kunder som redan letar.", ingress "Creamfile betyder gräddfil — den snabba vägen förbi kön. Förbi sökannonser och algoritmer, rakt fram till människor som redan bestämt sig.", tre punkter med H3 + text enligt designförslaget (Trafik med syfte / Riktiga sajter, inte parkerade domäner / Egen mark, långa horisonter), knapp "Ta gräddfilen" → /annonsera. Kort med ram: H2 "Äger du en generisk adress?", text, sekundär knapp "Berätta om din domän" → /kontakt?amne=doman. Sidfot.

**Portfölj `/portfolj`.** H1 "{antal} sajter. Sex affärsområden. En idé." (antalet beräknat), ingress enligt designen. Sedan en sektion per grupp i datafilens ordning: gruppnamn, intro, antal, och ett kort per sajt med domännamn (punkten i Kobolt), beskrivning, språkkoder som etikett (SV · DA · NO), och etiketten "Under uppbyggnad" när `status: building`. Hela kortet är en länk till sajtens `url` (öppnas i ny flik, `rel="noopener"`). Varje grupp har ett ankare (`#guider`, `#finans` …) så att sidfoten och annonsera-sidan kan länka dit.

**Annonsera `/annonsera`.** Etikett "Annonsera", H1 "Gräddfilen till kunder som redan letar.", ingress "Creamfile betyder gräddfil. Våra adresser är den snabba vägen förbi sökannonser och algoritmer — rakt fram till människor som redan bestämt sig för vad de vill ha. Fyra sätt att synas:". Fyra erbjudandekort i 2×2 med nummer (01–04 i Kobolt, Fraunces), H3, text, prisrad och länk "Läs mer →" som i v1 pekar på /kontakt med förifyllt ämne. Innehåll: (01) Synas på en sajt — "Från [PRIS] kr/mån"; (02) Synas i ett område — "Offert"; (03) Bli hittad av dina kunder — "Från 199 kr/mån"; (04) Data och partnerskap — "Offert". Texterna exakt som i designförslaget. Mörk CTA-sektion: etikett "Kontakt", H2 "Berätta vilka du vill nå. Vi visar gräddfilen dit.", text, Honung-knapp "Kontakta oss" → /kontakt, mailadress som länk.

**Om Creamfile `/om`.** Etikett "Om Creamfile", H1 "Gräddfil på nätet, sedan 2004." (alternativ om Ben ändrar sig efter utvärdering: "Den som äger ordet äger kategorin."), fyra stycken brödtext enligt designförslaget, fyra kärnvärden i en rad med övre kantlinje (Självklarhet, Nytta före räckvidd, Ägande, Långsiktighet), mörk sektion "En motor, många adresser." med de sex områdena och en rad vardera (genereras ur `groups` i datafilen: `name` + ett nytt fält `tagline`, se bilaga A), kontaktkort med e-post, org.nr, adress och länk till annonsera.

**Kontakt `/kontakt`.** H1 "Kontakta oss", kort ingress, formulär (namn, företag, e-post, ämne som rullista: Annonsera / Premiumprofil / Data & partnerskap / Sälja domän / Annat, meddelande, Turnstile, knapp "Skicka"). Ämnet förifylls från `?amne=`. Vid lyckad sändning visas en tackruta på samma sida (ingen separat sida, ingen sidladdning). Bredvid formuläret: e-post, org.nr, postadress.

**Integritetspolicy `/integritetspolicy`.** Standardtext för en sajt utan cookies utöver Turnstile och Cloudflare Web Analytics; Ben levererar text, dev lägger in som markdown-sida.

**404.** Logotyp, "Den här adressen finns inte — men de här gör det:" och domänlistan från startsidan.

## 5. Design och tokens

Allt visuellt är specificerat i `creamfile-visuell-identitet.md`; designförslaget är referensen för layout. Tokens kopieras in i `tokens.css` exakt:

```css
:root{
  --color-bg:#F5F0E6; --color-surface:#FBF8F2; --color-ink:#17150F; --color-ink-soft:#4A463D;
  --color-muted:#736C5E; --color-accent:#1F3A93; --color-accent-dk:#172D75; --color-honey:#D9A441;
  --color-line:#E7E0D2; --color-line-soft:#EEE8DC; --color-border-ui:#D6CEBE;
  --font-display:'Fraunces','Iowan Old Style',Georgia,serif;
  --font-body:'Inter','Segoe UI',system-ui,sans-serif;
  --radius-btn:6px; --radius-card:8px; --max-w:1200px;
}
```

Typsnitt: Fraunces (variabel, opsz 9–144, wght 400–600, kursiv) och Inter (400/500/600) **självhostade** i `public/fonts/` som woff2 med `font-display: swap` och preload av de två filer som används ovanför vikningen — inte Google Fonts-länk (prestanda och GDPR). Fraunces sätts med `font-variation-settings: "opsz" 144, "SOFT" 50` i H1 och logotyp, `"opsz" 48, "SOFT" 0` i H2 och citat. Tabellsiffror med `font-variant-numeric: tabular-nums`.

Komponentregler att följa: inga pillerknappar (6 px radie), kort 8 px utan skugga, etiketter 12 px/600/versaler/0.12em, aldrig ren vit eller ren svart, Honung bara på Bläck, Kobolt enda accent på ljus botten, maximalt 68 tecken radlängd för brödtext, vänsterställda rubriker. Ikoner som inline-SVG stroke 1.5 — inga ikonbibliotek, inga emoji.

Logotypen är ordbilden `creamfile.` (SVG-filer i `creamfile-logotyp/`): ljus variant i header och sidfot, mörk på Bläck-ytor. Favicon från `creamfile-symbol.svg`. Ordbilden i header får gärna vara text i Fraunces (snabbare och skalbar) med punkten i ett `<span>` i accentfärg — resultatet ska vara identiskt med SVG:n.

Responsivt: mobilartboarden i designförslaget visar 390 px. Brytpunkter 640 / 1024 px. Sidmarginal 20 px på mobil, 64 px från 1024. Grupper på startsidan staplas; portföljkorten går 3 → 2 → 1 kolumn. Bevisraden tre tal i rad även på mobil.

Inget mörkt läge i v1. `color-scheme: light`.

## 6. Datafilen och hur den används

`src/data/sites.yaml` (bilaga A) är sanningen. Regler för rendering:

Antal sajter = sajter utan `hidden: true`. Antal grupper = grupper som har minst en synlig sajt. Hero-meningen listar sajter med `featured: true` i filens ordning, max fem, följt av "och ett fyrtiotal andra sajter" — dev gör ordet beroende av antalet (under 30: "och {n} andra sajter"; 30–49: "ett fyrtiotal"; 50+: "ett femtiotal"). Domännamn renderas alltid via `DomainName.astro`, som delar på sista punkten och färgar den. `url` används som länkmål (punycode), `domain` som visningstext (med å/ä/ö). `status: building` visar etiketten "Under uppbyggnad" och gråar inte ut kortet. Språkkoder visas versala, separerade med " · "; `multi` visas som "Flera språk".

Validering (Zod): `group` måste finnas i `groups`, `status` är `live | building`, `languages` är en icke-tom lista ur den tillåtna mängden, `domain` och `url` är obligatoriska, `description` max 120 tecken. Bygget ska faila med raden i filen som felmeddelande.

Sidfoten genereras ur `groups` (gruppnamn som länkar till `/portfolj#id`) plus en fast kolumn "Företag" (Annonsera, Premiumprofiler, Data & partnerskap, Sälj din domän — alla till /annonsera eller /kontakt) och en kolumn med bolagsuppgifter ur `site.ts`.

## 7. Kontaktformulär (`/api/kontakt`)

POST med JSON eller form-data: `namn`, `foretag` (valfritt), `epost`, `amne`, `meddelande`, `cf-turnstile-response`, plus ett honeypot-fält `webbplats` som ska vara tomt. Workern verifierar Turnstile mot Cloudflares API, validerar e-postformat och längder (meddelande 20–3 000 tecken), och skickar via Resend från `kontakt@creamfile.com` till `info@creamfile.com` med `reply-to` satt till avsändaren och ämnesraden `[creamfile.com] {amne} — {foretag eller namn}`. Svar `200 {ok:true}` eller `400 {ok:false, error}`. Rate limit 5 per IP per timme via Cloudflare Rate Limiting-regel på routen. Hemligheter (`TURNSTILE_SECRET`, `RESEND_API_KEY`) som Worker-secrets, aldrig i repo. Formuläret fungerar utan JavaScript (vanlig POST med redirect till `/kontakt?skickat=1`) och förbättras med fetch när JS finns.

DNS för utgående mail: SPF, DKIM och DMARC för creamfile.com sätts upp i Resend och Cloudflare DNS innan lansering (samma rutin som för bröllop.se).

## 8. SEO, analys och prestanda

Titlar och beskrivningar per sida (dev föreslår, Ben godkänner): startsida "Creamfile — Sveriges självklara adresser"; portfölj "Portföljen — {n} sajter i sex affärsområden | Creamfile"; annonsera "Annonsera hos Creamfile — gräddfilen till kunder som redan letar"; om "Om Creamfile"; kontakt "Kontakta Creamfile". Canonical på varje sida, `sitemap.xml` via `@astrojs/sitemap`, `robots.txt` som tillåter allt utom `/api/`. Schema.org `Organization` i JSON-LD på startsidan med namn, logotyp, `sameAs` (LinkedIn om finns) och `contactPoint`. Open Graph-bild: en genererad 1200×630 i Grädde med ordbilden och taglinen (statisk fil räcker i v1).

Analys: **Cloudflare Web Analytics** (cookiefri, ingen banner behövs). Ingen GA4, ingen AdSense, inga tredjepartsskript utöver Turnstile på kontaktsidan.

Prestandabudget: Lighthouse 95+ på alla fyra kategorier på mobil; LCP under 1,5 s på 4G; total sidvikt startsida under 300 kB inklusive typsnitt; inga layoutskiften vid typsnittsladdning (använd `size-adjust` i fallback-face eller preload). Bilder: inga i v1 utöver logotyp och OG-bild.

Tillgänglighet: semantiska landmärken, skip-link, synlig fokusring (2 px Kobolt), kontrast enligt tokens (alla kombinationer är kontrollerade mot AA), formulärfält med `label`, felmeddelanden kopplade med `aria-describedby`, `prefers-reduced-motion` respekterat (det finns ingen animation att stänga av i v1, men regeln ska finnas).

## 9. Domän, redirects och lansering

creamfile.com pekas till Cloudflare (nameservers byts om domänen inte redan ligger där). **creamfile.se** behålls och redirectar permanent (301) till creamfile.com: `/` → `/`, `/vara-medier/` → `/portfolj`, `/kontakt/` → `/kontakt`, allt annat → `/`. Redirects läggs som Cloudflare Bulk Redirects eller i `public/_redirects`, inte i gamla WordPress-installationen, som stängs ner efter lansering. `www.creamfile.com` → apex.

Lanseringschecklista: DNS och SSL grönt, redirects testade, kontaktformulär testat med riktigt mail fram till inkorgen, Turnstile i produktionsläge, DMARC-rapport inkommen, sitemap inskickad i Search Console, 404-sida kontrollerad, Lighthouse-körning sparad i repo under `docs/`.

## 10. Hur portföljen uppdateras efter lansering

Dokumenteras i `README.md` med exempel: lägg till en sajt (kopiera ett block i `sites.yaml`), flytta en sajt (byt `group`), markera under uppbyggnad (`status: building`), dölj utan att radera (`hidden: true`), lägg till en grupp (nytt block under `groups` + sajter som pekar på det). Varje ändring via pull request får en preview-länk att titta på innan merge. Om Ben vill redigera utan Git: aktivera Keystatic (lokal mode mot GitHub) som ett valfritt steg efter v1.

## 11. Leverans och acceptans

Dev levererar repot, en produktions-URL och README. Acceptans sker mot designförslaget sida för sida (Ben + Claude), mot kraven i §6–8, och mot checklistan i §9. Avvikelser från designförslaget ska vara motiverade i PR-beskrivningen, inte tysta.

**Utanför v1:** engelsk version, blogg/nyheter, inloggning, prislistor med köp, mörkt läge, CMS-gränssnitt, pressrum. Alla är enkla att lägga till senare just för att sajten är en Astro-sajt med en datafil.

**Öppna punkter Ben fyller i:** org.nr, postadress, pris för "Synas på en sajt", text till integritetspolicy, LinkedIn-länk om den ska med, och om Om-rubriken ska vara "Gräddfil på nätet, sedan 2004" eller "Den som äger ordet äger kategorin".

---

## Bilaga A — `sites.yaml`

Filen levereras separat som `sites.yaml` i samma mapp och kopieras till `src/data/sites.yaml` som den är. Ett fält tillkommer per grupp som dev lägger till: `tagline` (en rad för "En motor, många adresser"-sektionen): Guider & leads "Kataloger, premiumprofiler, leads"; Finansmarknad & trading "Kurser, marknadsdata och tradingverktyg, fem språk"; Privatekonomi "Verktyg på hushållets egen data"; Spel "Dagliga pussel och quiz"; Sport "Innehåll och community"; Handel "Butik med eget lager".

Zod-schema:

```ts
const Group = z.object({ id: z.string(), name: z.string(), internal: z.string().optional(),
  intro: z.string(), tagline: z.string() });
const Site = z.object({ domain: z.string(), group: z.string(), description: z.string().max(120),
  languages: z.array(z.enum(['sv','da','no','nl','en','multi'])).min(1),
  status: z.enum(['live','building']).default('live'), url: z.string().url(),
  featured: z.boolean().default(false), hidden: z.boolean().default(false) });
// efter parse: kontrollera att varje site.group finns bland groups[].id, annars kasta fel med domännamnet.
```

## Bilaga B — bolagsuppgifter (`site.ts`)

```ts
export const site = {
  name: 'Creamfile AB', domain: 'creamfile.com', tagline: 'Sveriges självklara adresser.',
  email: 'info@creamfile.com', orgNr: '[ORG-NR]', address: '[POSTADRESS]', since: 2004,
  linkedin: '' // valfritt
};
```
