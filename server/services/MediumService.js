const MEDIUM_API = 'https://api.medium.com/v1';

function mediumHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Charset': 'utf-8',
  };
}

function mapError(status, body) {
  if (status === 401) return { type: 'medium_api', message: 'That Medium token is invalid or has expired. Generate a new one at medium.com/me/settings.' };
  if (status === 429) return { type: 'medium_api', message: 'Medium API rate limit reached. Please try again in a few minutes.' };
  if (status >= 500) return { type: 'medium_api', message: 'Medium is temporarily unavailable. Please try again later.' };
  const detail = body?.errors?.[0]?.message;
  return { type: 'medium_api', message: detail || 'Medium rejected the request. Please check your token and try again.' };
}

async function validateToken(token) {
  let res;
  try {
    res = await fetch(`${MEDIUM_API}/me`, { headers: mediumHeaders(token) });
  } catch (err) {
    return { ok: false, ...mapError(0, null) };
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { ok: false, ...mapError(res.status, body) };
  }

  const body = await res.json();
  const data = body?.data;
  if (!data?.id || !data?.username) {
    return { ok: false, type: 'medium_api', message: 'Medium returned an unexpected response. Please try again.' };
  }

  return { ok: true, authorId: data.id, username: data.username };
}

async function publishPost({ token, authorId, title, content }) {
  let res;
  try {
    res = await fetch(`${MEDIUM_API}/users/${authorId}/posts`, {
      method: 'POST',
      headers: mediumHeaders(token),
      body: JSON.stringify({
        title,
        contentFormat: 'markdown',
        content,
        publishStatus: 'public',
      }),
    });
  } catch (err) {
    return { ok: false, ...mapError(0, null) };
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { ok: false, ...mapError(res.status, body) };
  }

  const body = await res.json();
  const data = body?.data;
  if (!data?.url) {
    return { ok: false, type: 'medium_api', message: 'Medium returned an unexpected response. Please try again.' };
  }

  return { ok: true, url: data.url, publishedAt: new Date() };
}

module.exports = { validateToken, publishPost };
