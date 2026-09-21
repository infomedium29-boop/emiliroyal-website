const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  }
});

const clean = (value, max = 500) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
};

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.WEB3FORMS_ACCESS_KEY) {
    return jsonResponse({ success: false, message: 'Kontakt forma trenutno nije dostupna.' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ success: false, message: 'Neispravan zahtjev.' }, 400);
  }

  // Honeypot: botovi često popune skriveno polje. Njima vraćamo neutralan uspjeh.
  if (body.botcheck) {
    return jsonResponse({ success: true });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 50);
  const passengers = clean(body.passengers, 50);
  const service = clean(body.service, 120);
  const travelDate = clean(body.travel_date, 20);
  const travelTime = clean(body.travel_time, 20);
  const message = clean(body.message, 3000);

  if (!name || !email || !service) {
    return jsonResponse({ success: false, message: 'Ispunite sva obavezna polja.' }, 400);
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return jsonResponse({ success: false, message: 'Unesite ispravnu email adresu.' }, 400);
  }

  const payload = {
    access_key: env.WEB3FORMS_ACCESS_KEY,
    subject: `Nova rezervacija — ${service}`,
    from_name: 'Emili Royal Transfers Web',
    name,
    email,
    'Telefon / WhatsApp': phone || 'Nije navedeno',
    'Broj putnika': passengers || 'Nije navedeno',
    'Vrsta usluge': service,
    'Datum putovanja': travelDate || 'Nije navedeno',
    'Željeno vrijeme': travelTime || 'Nije navedeno',
    message: message || 'Nema dodatne poruke.'
  };

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      console.error('Web3Forms error', response.status, result);
      return jsonResponse({ success: false, message: 'Slanje trenutno nije uspjelo.' }, 502);
    }

    return jsonResponse({ success: true, message: 'Rezervacija je uspješno poslana.' });
  } catch (error) {
    console.error('Contact function error', error);
    return jsonResponse({ success: false, message: 'Slanje trenutno nije uspjelo.' }, 502);
  }
}
