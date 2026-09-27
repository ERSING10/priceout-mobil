import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'
const CHUNK_SIZE = 100

Deno.serve(async (req) => {
  const webhookSecret = Deno.env.get('WEBHOOK_SECRET')
  const incomingSecret = req.headers.get('x-webhook-secret')
  if (webhookSecret && incomingSecret !== webhookSecret) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: newProducts, error: productsError } = await supabaseAdmin
    .from('products')
    .select('id')
    .eq('notified', false)

  if (productsError || !newProducts || newProducts.length === 0) {
    return new Response('No new products to notify', { status: 200 })
  }

  const { data: tokens, error: tokensError } = await supabaseAdmin
    .from('push_tokens')
    .select('id, device_token')
    .eq('enabled_notifications', true)

  if (tokensError || !tokens || tokens.length === 0) {
    return new Response('No tokens to notify', { status: 200 })
  }

  const messages = tokens.map((t) => ({
    to: t.device_token,
    sound: 'default',
    title: 'Yeni ürünler seni bekliyor!',
    body: `Bu hafta ${newProducts.length} yeni ürün eklendi, hemen göz at.`,
  }))

  const invalidTokenIds: string[] = []

  for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
    const chunk = messages.slice(i, i + CHUNK_SIZE)
    const tokenChunk = tokens.slice(i, i + CHUNK_SIZE)

    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(chunk),
    })

    const result = await response.json()
    result.data?.forEach((ticket: any, index: number) => {
      if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
        invalidTokenIds.push(tokenChunk[index].id)
      }
    })
  }

  if (invalidTokenIds.length > 0) {
    await supabaseAdmin.from('push_tokens').delete().in('id', invalidTokenIds)
  }

  await supabaseAdmin
    .from('products')
    .update({ notified: true })
    .in('id', newProducts.map((p) => p.id))

  return new Response(
    JSON.stringify({ notified_products: newProducts.length, sent_to: messages.length }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})