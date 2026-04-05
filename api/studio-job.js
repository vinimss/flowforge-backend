// api/studio-job.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function cors(res, req) {
  const origin = req?.headers?.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-studio-key');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  return res;
}

function json(res, status, data) {
  return cors(res).status(status).json(data);
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return cors(res, req).status(200).end();
  cors(res, req);

  if (req.method === 'POST') {
    const { studioKey, prompts, settings } = req.body;
    if (!studioKey || !prompts?.length) {
      return json(res, 400, { error: 'studioKey e prompts obrigatorios' });
    }
    const { data: user } = await supabase
      .from('users')
      .select('id, email')
      .eq('studio_key', studioKey)
      .single();
    if (!user) return json(res, 401, { error: 'Studio key invalida' });

    await supabase
      .from('studio_jobs')
      .update({ status: 'cancelled' })
      .eq('user_id', user.id)
      .in('status', ['pending', 'running']);

    const mergerJobId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    const { data: job, error } = await supabase
      .from('studio_jobs')
      .insert({
        user_id: user.id,
        status: 'pending',
        prompts,
        settings: {
          ...(settings || {}),
          mergerJobId,
          serverUrl: process.env.SERVER_URL || 'http://104.236.206.211:3000',
          totalPrompts: prompts.length,
        },
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return json(res, 500, { error: error.message });

    try {
      const srvUrl = process.env.SERVER_URL || 'http://104.236.206.211:3000';
      await fetch(`${srvUrl}/api/video-merger/create-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: mergerJobId,
          prefix: 'prompt_',
          duration: settings?.segment || 8,
          totalFiles: prompts.length,
          fillMode: 'smart'
        })
      });
    } catch (e) {
      console.warn('Could not pre-create merger job:', e.message);
    }

    return json(res, 200, { ok: true, jobId: job.id, mergerJobId });
  }

  if (req.method === 'GET') {
    const { jobId, poll, token } = req.query;

    if (poll === '1' && token) {
      const { data: session } = await supabase
        .from('user_sessions')
        .select('user_id')
        .eq('session_token', token)
        .eq('is_active', true)
        .single();
      if (!session) return json(res, 401, { error: 'Sessao invalida' });

      const { data: job } = await supabase
        .from('studio_jobs')
        .select('*')
        .eq('user_id', session.user_id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!job) return json(res, 200, { job: null });

      await supabase
        .from('studio_jobs')
        .update({ status: 'running', started_at: new Date().toISOString() })
        .eq('id', job.id);

      return json(res, 200, { job: { id: job.id, prompts: job.prompts, settings: job.settings } });
    }

    if (jobId) {
      const { data: job } = await supabase
        .from('studio_jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      if (!job) return json(res, 404, { error: 'Job nao encontrado' });
      return json(res, 200, {
        jobId: job.id,
        status: job.status,
        progress: job.progress || 0,
        message: job.message || '',
        sent: job.sent || 0,
        ready: job.ready || 0,
        downloaded: job.downloaded || 0,
        total: job.prompts?.length || 0,
        mergerJobId: job.settings?.mergerJobId || null,
        failedPrompts: job.failed_prompts || [],
        updatedAt: job.updated_at,
      });
    }

    return json(res, 400, { error: 'Parametros invalidos' });
  }

  if (req.method === 'PATCH') {
    const { jobId, token, status, progress, message, sent, ready, downloaded, failedPrompts } = req.body;
    if (!jobId || !token) return json(res, 400, { error: 'jobId e token obrigatorios' });

    const { data: session } = await supabase
      .from('user_sessions')
      .select('user_id')
      .eq('session_token', token)
      .eq('is_active', true)
      .single();
    if (!session) return json(res, 401, { error: 'Sessao invalida' });

    const update = { updated_at: new Date().toISOString() };
    if (status !== undefined) update.status = status;
    if (progress !== undefined) update.progress = progress;
    if (message !== undefined) update.message = message;
    if (sent !== undefined) update.sent = sent;
    if (ready !== undefined) update.ready = ready;
    if (downloaded !== undefined) update.downloaded = downloaded;
    if (failedPrompts !== undefined) update.failed_prompts = failedPrompts;
    if (status === 'done' || status === 'error') update.finished_at = new Date().toISOString();

    const { error } = await supabase
      .from('studio_jobs')
      .update(update)
      .eq('id', jobId)
      .eq('user_id', session.user_id);

    if (error) return json(res, 500, { error: error.message });
    return json(res, 200, { ok: true });
  }

  return json(res, 405, { error: 'Method not allowed' });
}
