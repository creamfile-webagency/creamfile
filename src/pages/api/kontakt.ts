import type { APIContext } from 'astro';

export const prerender = false;

// Secrets are Cloudflare Worker env vars — set via `wrangler secret put`, never in repo.
// For local dev, create dev.vars (gitignored) with TURNSTILE_SECRET and RESEND_API_KEY.
// Rate limiting (5 req/IP/hour) is configured as a Cloudflare Rate Limiting rule on
// the route creamfile.com/api/kontakt — no Worker code needed.
interface Env {
  TURNSTILE_SECRET: string;
  RESEND_API_KEY: string;
}

export async function POST({ request }: APIContext): Promise<Response> {
  const env = (import.meta as any).env as Env;

  // Parse request body: JSON for fetch() callers, form-data for no-JS fallback
  let fields: Record<string, string>;
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    fields = await request.json();
  } else {
    const fd = await request.formData();
    fields = Object.fromEntries(fd.entries()) as Record<string, string>;
  }

  // Honeypot: silently accept so bots don't learn the field name
  if (fields.webbplats) {
    return redirectOrJson(request, true);
  }

  // Turnstile verification
  const turnstileRes = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: fields['cf-turnstile-response'] ?? '',
        remoteip: request.headers.get('CF-Connecting-IP') ?? '',
      }),
    }
  );
  const turnstileData = (await turnstileRes.json()) as { success: boolean };
  if (!turnstileData.success) {
    return errorResponse(request, 'Ogiltig säkerhetscheck. Försök igen.');
  }

  // Field validation
  const { namn, epost, amne, meddelande, foretag = '' } = fields;
  const subjectMap: Record<string, string> = {
    annonsera: 'Annonsera',
    premie:    'Premiumprofiler',
    data:      'Data & partnerskap',
    doman:     'Sälja domän',
    annat:     'Annat',
  };

  if (!namn?.trim()) return errorResponse(request, 'Namn saknas.');
  if (!epost?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    return errorResponse(request, 'Ogiltig e-postadress.');
  if (!subjectMap[amne]) return errorResponse(request, 'Ogiltigt ämne.');
  if (!meddelande || meddelande.length < 20 || meddelande.length > 3000)
    return errorResponse(request, 'Meddelandet måste vara 20–3 000 tecken.');

  const amneLabel = subjectMap[amne];

  // Send via Resend
  const subject = `[creamfile.com] ${amneLabel} — ${foretag || namn}`;

  const mailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'kontakt@creamfile.com',
      to: ['info@creamfile.com'],
      reply_to: epost,
      subject,
      text: `Namn: ${namn}\nFöretag: ${foretag || '–'}\nE-post: ${epost}\nÄmne: ${amneLabel}\n\n${meddelande}`,
      html: `<p><strong>Namn:</strong> ${escapeHtml(namn)}<br>
             <strong>Företag:</strong> ${escapeHtml(foretag || '–')}<br>
             <strong>E-post:</strong> ${escapeHtml(epost)}<br>
             <strong>Ämne:</strong> ${escapeHtml(amneLabel)}</p>
             <p>${escapeHtml(meddelande).replace(/\n/g, '<br>')}</p>`,
    }),
  });

  if (!mailRes.ok) {
    console.error('Resend error:', await mailRes.text());
    return errorResponse(request, 'Kunde inte skicka meddelandet. Försök igen.');
  }

  return redirectOrJson(request, true);
}

function isJsonRequest(req: Request): boolean {
  const accept = req.headers.get('accept') ?? '';
  const ct = req.headers.get('content-type') ?? '';
  return ct.includes('application/json') || accept.includes('application/json');
}

function redirectOrJson(req: Request, ok: boolean): Response {
  if (isJsonRequest(req)) {
    return new Response(JSON.stringify({ ok }), {
      status: ok ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return Response.redirect(new URL('/kontakt?skickat=1', req.url).toString(), 303);
}

function errorResponse(req: Request, error: string): Response {
  if (isJsonRequest(req)) {
    return new Response(JSON.stringify({ ok: false, error }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return Response.redirect(
    new URL(`/kontakt?fel=${encodeURIComponent(error)}`, req.url).toString(),
    303
  );
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
