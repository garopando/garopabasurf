export async function POST(request) {
  const { email } = await request.json()

  if (!email) {
    return Response.json({ error: 'Email obrigatorio' }, { status: 400 })
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email,
        listIds: [2],
        updateEnabled: true,
      }),
    })

    if (response.ok || response.status === 204) {
      return Response.json({ success: true })
    }

    const data = await response.json()
    return Response.json({ error: data.message }, { status: 400 })
  } catch (error) {
    return Response.json({ error: 'Erro ao cadastrar' }, { status: 500 })
  }
}
