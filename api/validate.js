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

function getBearer(req) {
  const h = req.headers?.authorization || req.headers?.Authorization || "";
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1] : null;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });

  const token = getBearer(req);
  if (!token) return json(res, 401, { ok: false });

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !JWT_SECRET) {
    return json(res, 500, { ok: false, error: "Server env missing" });
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return json(res, 401, { ok: false });
  }

  const userId = payload?.sub;
  if (!userId) return json(res, 401, { ok: false });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });

  const { data: lic, error: licErr } = await supabase
    .from("licenses")
    .select("active, expires_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (licErr) return json(res, 500, { ok: false });

  const ok = !!(lic && lic.active && lic.expires_at && new Date(lic.expires_at).getTime() > Date.now());
  return json(res, 200, { ok, expires_at: lic?.expires_at || null });
}
