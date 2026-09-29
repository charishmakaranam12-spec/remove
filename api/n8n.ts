const DEFAULT_N8N_WEBHOOK = 'https://charishma321.app.n8n.cloud/webhook/8196a360-cb57-43fc-ab0c-924bf73aa21b/chat';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { message, sessionId, webhookUrl } = body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message string is required' });
    }

    const targetUrl = webhookUrl || process.env.N8N_WEBHOOK_URL || DEFAULT_N8N_WEBHOOK;
    const session = sessionId || `session-${Date.now()}`;

    const n8nResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'sendMessage',
        sessionId: session,
        chatInput: message,
      }),
    });

    if (!n8nResponse.ok) {
      const errText = await n8nResponse.text();
      return res.status(n8nResponse.status).json({
        error: `n8n webhook returned ${n8nResponse.status}`,
        details: errText,
      });
    }

    const data = await n8nResponse.json();
    return res.status(200).json({
      output: data.output || data.response || data.text || (typeof data === 'string' ? data : JSON.stringify(data)),
      raw: data,
      sessionId: session,
    });
  } catch (err: any) {
    console.error('Error proxying to n8n in serverless function:', err);
    return res.status(500).json({ error: err.message || 'Internal error connecting to n8n' });
  }
}
