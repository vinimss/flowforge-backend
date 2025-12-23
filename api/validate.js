export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false, error: "Missing token" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    // por enquanto só valida presença do token
    // (depois ligamos com Supabase)
    return res.status(200).json({
      valid: true,
      token,
      expires_at: null
    });
  } catch (err) {
    return res.status(401).json({ valid: false });
  }
}
