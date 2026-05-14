/**
 * 管理者匯出：以 Firestore REST API 讀取
 * `artifacts/{appId}/users/*/quiz_results/latest`
 *
 * 不使用 firebase-admin（避免 gRPC 原生模組在 Netlify 上 502）。
 *
 * Netlify 環境變數：
 * - ADMIN_DASHBOARD_KEY
 * - FIREBASE_SERVICE_ACCOUNT_JSON_B64 或 FIREBASE_SERVICE_ACCOUNT_JSON
 * - FIREBASE_ARTIFACTS_APP_ID（選用，預設 default-app-id）
 */
const crypto = require('crypto');

function getAppId() {
  return process.env.FIREBASE_ARTIFACTS_APP_ID || 'default-app-id';
}

function getServiceAccountJsonString() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;
  if (b64 && String(b64).trim()) {
    const raw = String(b64).trim();
    if (/ReadAllBytes|ToBase64String|\[IO\.File\]|\[Convert\]::/i.test(raw)) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_JSON_B64 貼到的是 PowerShell「指令」，不是編碼結果。請在本機執行編碼後只貼輸出。'
      );
    }
    const decoded = Buffer.from(raw.replace(/\s/g, ''), 'base64').toString('utf8');
    const t = decoded.trimStart().replace(/^\uFEFF/, '');
    if (!t.startsWith('{')) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON_B64 解碼後不是 JSON（應以 { 開頭）。');
    }
    return decoded;
  }
  return String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '').trim();
}

function parseServiceAccountJson(raw) {
  const trimmed = String(raw ?? '').trim().replace(/^\uFEFF/, '');
  if (!trimmed) return null;
  return JSON.parse(trimmed);
}

function base64url(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlFromUtf8(str) {
  return base64url(Buffer.from(str, 'utf8'));
}

function createServiceAccountJwt(serviceAccount) {
  const header = base64urlFromUtf8(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64urlFromUtf8(
    JSON.stringify({
      iss: serviceAccount.client_email,
      sub: serviceAccount.client_email,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3500,
      scope: 'https://www.googleapis.com/auth/datastore',
    })
  );
  const signInput = `${header}.${payload}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signInput);
  const sigBuf = sign.sign(serviceAccount.private_key);
  const signature = base64url(sigBuf);
  return `${signInput}.${signature}`;
}

async function getAccessToken(serviceAccount) {
  const jwt = createServiceAccountJwt(serviceAccount);
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt,
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    throw new Error(json.error_description || json.error || `OAuth token failed (${res.status})`);
  }
  return json.access_token;
}

function firestoreValueToJs(v) {
  if (v == null || typeof v !== 'object') return v;
  if ('nullValue' in v) return null;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.integerValue !== undefined) return parseInt(v.integerValue, 10);
  if (v.doubleValue !== undefined) return v.doubleValue;
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.timestampValue !== undefined) return v.timestampValue;
  if (v.mapValue && v.mapValue.fields) {
    const o = {};
    for (const k of Object.keys(v.mapValue.fields)) {
      o[k] = firestoreValueToJs(v.mapValue.fields[k]);
    }
    return o;
  }
  if (v.arrayValue && v.arrayValue.values) {
    return v.arrayValue.values.map(firestoreValueToJs);
  }
  return v;
}

function documentToPlain(doc) {
  if (!doc || !doc.fields) return {};
  const out = {};
  for (const k of Object.keys(doc.fields)) {
    out[k] = firestoreValueToJs(doc.fields[k]);
  }
  return out;
}

function userIdFromDocumentName(name) {
  const parts = String(name).split('/');
  const idx = parts.lastIndexOf('users');
  if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
  return parts[parts.length - 1] || '';
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const provided = (body.key || event.headers['x-admin-key'] || '').trim();
  const expected = (process.env.ADMIN_DASHBOARD_KEY || '').trim();
  if (!expected || provided !== expected) {
    return { statusCode: 401, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  let saJson;
  try {
    saJson = getServiceAccountJsonString();
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message || 'Invalid service account env' }),
    };
  }
  if (!saJson) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: '未設定 FIREBASE_SERVICE_ACCOUNT_JSON_B64 或 FIREBASE_SERVICE_ACCOUNT_JSON。',
      }),
    };
  }

  try {
    const cred = parseServiceAccountJson(saJson);
    if (!cred || !cred.private_key || !cred.client_email || !cred.project_id) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: '服務帳戶 JSON 缺少 project_id、private_key 或 client_email。' }),
      };
    }

    const accessToken = await getAccessToken(cred);
    const projectId = cred.project_id;
    const appId = getAppId();
    const apiRoot = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
    const listBase = `${apiRoot}/artifacts/${encodeURIComponent(appId)}/users`;

    const userIds = [];
    let pageToken = '';
    for (;;) {
      const url = new URL(listBase);
      url.searchParams.set('pageSize', '300');
      if (pageToken) url.searchParams.set('pageToken', pageToken);
      const listRes = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const listJson = await listRes.json().catch(() => ({}));
      if (!listRes.ok) {
        throw new Error(listJson.error?.message || listJson.error || `List users failed (${listRes.status})`);
      }
      for (const doc of listJson.documents || []) {
        const uid = userIdFromDocumentName(doc.name);
        if (uid) userIds.push(uid);
      }
      pageToken = listJson.nextPageToken || '';
      if (!pageToken) break;
    }

    const submissions = [];
    for (const userId of userIds) {
      const docUrl = `${apiRoot}/artifacts/${encodeURIComponent(appId)}/users/${encodeURIComponent(userId)}/quiz_results/latest`;
      const docRes = await fetch(docUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (docRes.status === 404) continue;
      const docJson = await docRes.json().catch(() => ({}));
      if (!docRes.ok) {
        if (docJson.error?.code === 404) continue;
        throw new Error(docJson.error?.message || `Read latest failed (${docRes.status})`);
      }
      const data = documentToPlain(docJson);
      submissions.push({
        firebaseUserId: userId,
        ...data,
      });
    }

    submissions.sort((a, b) => String(b.timestamp || '').localeCompare(String(a.timestamp || '')));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ count: submissions.length, submissions }),
    };
  } catch (err) {
    console.error('admin-data error', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'Server error' }),
    };
  }
};
