# creamfile.com — Granskning 1 mot spec rev. 1.1

*2026-10-04. Granskad i Chrome (desktop 1440 px och 390 px-vy), plus innehållskontroll av alla sidor. Underlag: `creamfile-com-dev-spec.md`, `creamfile-visuell-identitet.md`, `creamfile-com-designforslag.html`.*

---

## Sammanfattning

Sajten är mycket nära specen och känns rätt: typografin sitter (Fraunces självhostad med rätt opsz/SOFT-axlar, Inter som brödtext, size-adjust-fallback), alla 38 sajter i sex grupper är på plats med rätt språkkoder och "Under uppbyggnad", gräddfil-copyn är inlagd på startsida, annonsera och om, bevisraden räknar ur datafilen, JSON-LD och canonical finns, Cloudflare Web Analytics är enda tredjepartsskriptet, HTML:en är 20 kB utan bilder, mobilvyn fungerar med hamburgermeny, och 404-sidan är byggd enligt spec. Formuläret har honeypot (dolt) och rätt fält.

Det som återstår är sex punkter, varav två måste fixas före lansering.

## Måste fixas före lansering

**1. Turnstile saknas på kontaktformuläret.** Ingen widget och inget Turnstile-skript laddas på /kontakt. Utan den är `/api/kontakt` öppen för spam-bots trots honeypot. Spec §7. Kontrollera också att Workern faktiskt verifierar `cf-turnstile-response` server-side, inte bara att widgeten visas.

**2. creamfile.se redirectar inte.** `creamfile.se/` visar fortfarande gamla WordPress-sajten ("Premium Advertising Online") och `/vara-medier/` ger 404 från LiteSpeed. Spec §9: 301 till creamfile.com (`/` → `/`, `/vara-medier/` → `/portfolj`, `/kontakt/` → `/kontakt`, övrigt → `/`). Sätts i Cloudflare-zonen för creamfile.se (Bulk Redirects eller Redirect Rules), och gamla installationen stängs.

## Bör fixas

**3. www.creamfile.com serverar sajten i stället för att redirecta.** `www.creamfile.com/om` svarar 200 med innehåll. Canonical pekar på apex så Google klarar det, men specen säger redirect www → apex (Redirect Rule i zonen).

**4. Hela toppdomänen är i accentfärg, inte bara punkten.** På startsidans mörka sektion är `.se`/`.com` i Honung och på portföljkorten i Kobolt. Identiteten säger: punkten är det enda grafiska elementet i accent, toppdomänen i samma färg som namnet. Det syns tydligast i domänlistan där det blir en orange "konfetti"-effekt över hela sektionen. Rättas i `DomainName.astro`.

**5. `?amne=` förifyller inte ämnesrullistan.** `/kontakt?amne=doman` lämnar rullistan på "Välj ämne". Länkarna "Sälja domän →" m.fl. på kontaktsidan och "Berätta om din domän" på startsidan förväntar sig detta (spec §4 Kontakt). Kontrollera att parametervärdet matchar optionens `value`.

## Småsaker

**6. "Ta gräddfilen"-knappen på startsidan är full bredd** i annonsörssektionen; designen har den i naturlig bredd (`align-self: flex-start`). Dessutom: språkkoden `multi` visas som "MULTI" — spec säger "Flera språk". Portföljsidans ingress är omskriven jämfört med designen ("Samlade bildar de en plattform för annonsörer, partners och läsare…") — fungerar, men det är en avvikelse som ska vara medveten; originalet nämner motor-tanken. Headern är sticky, vilket inte står i specen men fungerar bra — behåll.

## Kvar från Bens sida

Org.nr och postadress ([ORG-NR], [POSTADRESS] syns i sidfot, om och kontakt), pris på "Synas på en sajt" ([PRIS]), text till integritetspolicyn, LinkedIn-länk om den ska in i JSON-LD.

## Inte kontrollerat i denna omgång

Lighthouse-körning (dev levererar enligt §8), att formuläret faktiskt levererar mail till inkorgen med rätt reply-to, SPF/DKIM/DMARC för utgående mail, sitemap i Search Console. Tas på granskning 2 när punkt 1–2 är åtgärdade.
