import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const { email, password } = req.body || {};
  if (!email || !password) return json(res, 400, { error: "email and password required" });
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !JWT_SECRET) {
    return json(res, 500, { error: "Server env missing" });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });

  // Autenticar via Supabase Auth (server-side)
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError || !signInData?.user?.id) {
    return json(res, 401, { error: "Invalid credentials" });
  }

  const userId = signInData.user.id;

  // Buscar licença (MVP: 1 licença por user)
  const { data: lic, error: licErr } = await supabase
    .from("licenses")
    .select("active, expires_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (licErr) return json(res, 500, { error: "License lookup failed" });

  const license_ok = !!(lic && lic.active && lic.expires_at && new Date(lic.expires_at).getTime() > Date.now());
  const expires_at = lic?.expires_at || null;

  // Emitir token próprio (não é o access_token do Supabase)
  const token = jwt.sign(
    { sub: userId, email, typ: "flowforge" },
    JWT_SECRET,
    { expiresIn: "30d" }
  );

  return json(res, 200, { token, license_ok, expires_at });
}
