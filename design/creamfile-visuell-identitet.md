# Creamfile AB — Visuell identitet & designtokens

*Utkast 3, 2026-10-03 (rev. 2 anpassar portföljen till sex affärsområden; rev. 3 knyter färgen till namnhistorien gräddfil). Riktning för moderbolagets identitet: creamfile.com, säljpresentationer, avtal, sidfötter på dottersajterna. Samma format som `brollop-se-designtokens.md` så att det kan användas direkt som dev-referens.*

---

## Idé

Creamfile syns i sammanhang där det ska inge förtroende hos en marknadschef eller en krögare, inte locka en konsument. Identiteten ska därför kännas som ett förlag eller ett fastighetsbolag med god smak: lugn, varm, exakt. Namnet ger färgen — grädde — och den blir grunden. Sedan rev. 3 betyder det mer än en varm ton: Creamfile är engelska för gräddfil, och grädden som sidbakgrund är namnet gjort till yta. Den mörka Bläck-sektionen som skär genom varje sida kan läsas som filen på vägen — ett motiv att ta vidare i en framtida logotypvariant, men inte något som ska illustreras bokstavligt (inga vägar, inga pilar, inga mjölkpaket). Ovanpå den ett nästan svart bläck för allt som ska läsas, och en enda kall accent som gör att helheten inte blir ett bageri. Dottersajterna får vara färgstarka; Creamfile är ramen runt dem.

Två ord att hålla i huvudet: **grädde och bläck**. Om ett designval inte kan beskrivas med de orden är det förmodligen fel.

## Färger

```css
:root {
  --color-bg:        #F5F0E6;  /* Grädde — sidbakgrund */
  --color-surface:   #FBF8F2;  /* Mjölk — kort, header, ytor */
  --color-ink:       #17150F;  /* Bläck — text, mörka ytor, primär knapp */
  --color-ink-soft:  #4A463D;  /* Sekundär text */
  --color-muted:     #736C5E;  /* Metadata, etiketter, platshållare (4.6:1 mot Grädde) */
  --color-accent:    #1F3A93;  /* Kobolt — länkar, fokus, den enda accenten */
  --color-accent-dk: #172D75;  /* Kobolt hover */
  --color-honey:     #D9A441;  /* Honung — endast mot Bläck: siffror, markeringar */
  --color-line:      #E7E0D2;  /* Kortkanter, tabellinjer */
  --color-line-soft: #EEE8DC;  /* Avdelare header/footer */
  --color-border-ui: #D6CEBE;  /* Formulär- och sekundärknappskanter */
}
```

Regler: aldrig ren vit (#FFF endast som textfärg på Bläck), aldrig ren svart. Kobolt är den enda accenten på ljus botten och används sparsamt — länkar, fokusringar, en enda markerad siffra per vy. Honung används bara på Bläck-ytor (mörka sektioner, säljpresentationers slutsida) och aldrig bredvid Kobolt. Ingen gradient, inga skuggor utöver den i komponentavsnittet.

Bläck-ytor (`background: var(--color-ink)`) används för en sektion per sida, vanligen portföljlistan eller ett citat, med text i Mjölk och siffror i Honung. Det är sidans tyngdpunkt.

Varför Kobolt: det kalla blå mot varm grädde ger kontrast utan att skrika, associerar till bläck, stämplar och tryck, och kolliderar inte med någon av dottersajternas accenter (Rosewood på bröllop.se, kommande färger på restaurang.com). Kontrast Kobolt på Grädde 8.9:1, Bläck på Grädde 16:1, Honung på Bläck 8.1:1, Muted på Grädde 4.6:1 — alla klarar AA även för etikettstorlek (kontrollerat).

## Typografi

Google Fonts: **Fraunces** (variabel, optisk storlek; vikter 400/500/600, plus kursiv) och **Inter** (400/500/600).

```css
--font-display: 'Fraunces', 'Iowan Old Style', Georgia, serif;   /* logotyp, H1–H2, citat, stora tal */
--font-body:    'Inter', 'Segoe UI', system-ui, sans-serif;       /* allt annat */
```

Fraunces har en mjuk, lite gammaldags karaktär som ger "grädde" i själva bokstäverna och skiljer sig tydligt från Cormorant på bröllop.se. Vid display-storlekar används den optiska storleksaxeln (`font-variation-settings: "opsz" 144`) och `"SOFT" 50` för de rundare formerna; i mindre grad (H2, citat) `"opsz" 48, "SOFT" 0`. Inter är den neutrala motvikten och gör tabeller, siffror och formulär exakta; tabellsiffror sätts alltid med `font-variant-numeric: tabular-nums`.

Skala: H1 64/1.05 (display 500, letter-spacing −0.01em), H2 40/1.15 (display 500), H3 24/1.3 (body 600), ingress 20/1.5 (body 400, ink-soft), bröd 17/1.6, UI/knapp 15 (600), etikett 12 (600, letter-spacing 0.12em, versaler, muted). Stora tal i bevisraden ("38 sajter", "6 områden", "sedan 2004") sätts i display 400 vid 56–72 px.

Maxbredd för löptext 68 tecken. Rubriker får inte centreras; identiteten är vänsterställd och kolumnbaserad, som en tidning.

## Logotyp

**Ordbild: `creamfile.`** i Fraunces 500, gemener, med en avslutande punkt. Punkten är det enda grafiska elementet och sätts alltid i accentfärg — Kobolt på ljus botten, Honung på Bläck. Punkten säger "adress" utan att skriva ut toppdomänen, och den fungerar oavsett om det står .com eller .se bredvid. I sidfötter skrivs "creamfile.com" ut i sin helhet med samma punkt i accent.

Bolagsvariant för avtal och fakturor: `creamfile.` följt av " AB" i Inter 500, muted, med ett mellanslag. Aldrig "CreamFile", aldrig versal C i ordbilden (versal C används i löptext, inte i logotypen).

**Symbol/favicon:** en rundad kvadrat i Bläck (radius 22 % av sidan) med ett gement "c" i Fraunces och punkten i Kobolt nedanför till höger, ungefär som "c." Används för favicon, sociala profiler och som avsändarikon i mail. Aldrig som ersättning för ordbilden i tryck.

Frizon: punktens diameter × 4 runt hela ordbilden. Minsta storlek: 96 px bred på skärm, 20 mm i tryck. Förbjudet: gradienter, 3D, mappikoner, "file"-metaforer, att stryka punkten, att sätta ordbilden i Inter.

**Sidfotsrad på dottersajterna:** "En sajt från creamfile." i respektive sajts brödtypsnitt, med ordbilden i Fraunces länkad till creamfile.com. Storlek som övrig sidfotstext. Det är hela moderbolagets närvaro på konsumentsajterna.

## Komponentformer

Knappar: rektangulära med liten radie (`border-radius: 6px`), padding 12 px × 22 px, Inter 600. Primär = Bläck-bakgrund, Mjölk-text; sekundär = kantlinje `--color-border-ui`, Bläck-text; på Bläck-yta = Honung-bakgrund, Bläck-text. Inga pillerknappar (de tillhör bröllop.se). Kort: radius 8 px, kant `--color-line`, ingen skugga; vid hover kant `--color-border-ui`. Sajtkort i portföljen visar domännamnet som rubrik i Fraunces 24 med punkten i Kobolt, en rad beskrivning i Inter, och en etikett för affärsområde. Tabeller: linjer `--color-line`, rubrikrad i etikettstil, siffror högerställda med tabular-nums. Formulärfält: radius 6 px, kant `--color-border-ui`, fokus 2 px Kobolt.

Etiketter för affärsområde: Guider & leads, Finansmarknad & trading, Privatekonomi, Spel, Sport, Handel. Sätts som etikett (12/600/versaler/muted) utan bakgrund, aldrig som färgade badges. Språk per sajt visas som små versala koder (SV · DA · NO) i muted efter beskrivningen. Med 38 sajter visas portföljen på startsidan som kompakta domänlistor per grupp (domännamn i Fraunces 20, punkten i accent), och som kort först på portföljsidan.

## Ikoner och bilder

Inline-SVG, stroke 1.5, runda linjeändar, 16/20/24 px. Aldrig emoji. Bilder används sparsamt: creamfile.com bär i första hand typografi, domännamn och tal. Om bild behövs — skärmdumpar av dottersajterna i enkla Bläck-ramar (radius 8, 1 px kant), aldrig i mockade enheter.

## Layout och rytm

Tolvkolumnsraster, maxbredd 1200 px, marginal 24 px på mobil och 64 px från 1024 px. Vertikala sektioner 96–128 px på desktop, 64 px på mobil. Sidorna byggs som en tidning: en tydlig rubrikrad, sedan kolumner. Hero är text och en bevisrad med tre tal, inte en bild.

Mörkt läge behövs inte för creamfile.com i version 1; sajten är alltid grädde.

## Röst i gränssnittet

Knapptexter i imperativ och korta: "Kontakta oss", "Se portföljen", "Annonsera". Rubriker utan utropstecken och utan frågor i hero. Etiketter beskriver, säljer inte ("Sedan 2004", inte "Etablerad aktör").

## Tokens i sammanfattning

| Token | Värde | Användning |
|---|---|---|
| Grädde | #F5F0E6 | Sidbakgrund |
| Mjölk | #FBF8F2 | Ytor, kort |
| Bläck | #17150F | Text, mörka sektioner, primär knapp |
| Kobolt | #1F3A93 | Accent på ljus botten, logotypens punkt |
| Honung | #D9A441 | Accent på Bläck |
| Display | Fraunces 400–600 | Logotyp, H1–H2, citat, tal |
| Body | Inter 400–600 | Allt annat |
| Radie | 6 px knapp / 8 px kort | Inga piller |

Nästa steg: ta fram ordbild och symbol som SVG i tre varianter (ljus, mörk, monokrom), sätta upp tokens i en CSS-fil, och göra ett designförslag för creamfile.com (startsida, portfölj, annonsera, om oss, kontakt) i samma format som `brollop-se-designforslag.html`.

*Följedokument i Bizdev-mappen: `creamfile-varumarkesplattform.md`, `creamfile-portfoljstrategi.md`.*
