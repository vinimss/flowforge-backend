import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ ok: false, error: 'No token' })
  }

  const token = authHeader.replace('Bearer ', '').trim()

  const { data: userData, error: userError } =
    await supabase.auth.getUser(token)

  if (userError || !userData?.user) {
    return res.status(401).json({ ok: false, error: 'Invalid token' })
  }

  const userId = userData.user.id

  const { data: license, error: licenseError } = await supabase
    .from('licenses')
    .select('active, expires_at')
    .eq('user_id', userId)
    .single()

  if (
    licenseError ||
    !license ||
    !license.active ||
    new Date(license.expires_at) < new Date()
  ) {
    return res.status(403).json({ ok: false, error: 'License invalid' })
  }

  return res.status(200).json({
    ok: true,
    expires_at: license.expires_at
  })
}
