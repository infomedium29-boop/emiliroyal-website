const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  }
});

export async function onRequestGet(context) {
  const { env } = context;

  if (!env.WEB3FORMS_ACCESS_KEY) {
    return jsonResponse({ success: false, message: 'Kontakt forma trenutno nije dostupna.' }, 500);
  }

  // Web3Forms access keys are intended for client-side form submissions.
  // We keep the existing value in Cloudflare and expose it only when the form needs it.
  return jsonResponse({
    success: true,
    access_key: env.WEB3FORMS_ACCESS_KEY
  });
}
