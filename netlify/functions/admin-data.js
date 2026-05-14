/**
 * Admin export: Firestore REST only (no firebase-admin).
 * Env: ADMIN_DASHBOARD_KEY, FIREBASE_SERVICE_ACCOUNT_JSON_B64 or FIREBASE_SERVICE_ACCOUNT_JSON,
 *      FIREBASE_ARTIFACTS_APP_ID (optional, default default-app-id)
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
        'FIREBASE_SERVICE_ACCOUNT_JSON_B64: paste the Base64 output only, not the PowerShell command.'
      );
    }
    const decoded = Buffer.from(raw.replace(/\s/g, ''), 'base64').toString('utf8');
    const t = decoded.trimStart().replace(/^\uFEFF/, '');
    if (!t.startsWith('{')) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON_B64 decodes to non-JSON (must start with {).');
    }
    return decoded;
  }
  return String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '').trim();
}

function parseServiceAccountJson(raw) {
  const trimmed = String(raw || '').trim().replace(/^\uFEFF/, '');
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
  const payloadJson = JSON.stringify({
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3500,
    scope: 'https://www.googleapis.com/auth/datastore',
  });
  const payload = base64urlFromUtf8(payloadJson);
  const signInput = header + '.' + payload;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signInput);
  const sigBuf = sign.sign(serviceAccount.private_key);
  const signature = base64url(sigBuf);
  return signInput + '.' + signature;
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
  const json = await res.json().catch(function () {
    return {};
  });
  if (!res.ok || !json.access_token) {
    const msg =
      json.error_description ||
      json.error ||
      'OAuth token failed (' + String(res.status) + ')';
    throw new Error(msg);
  }
  return json.access_token;
}

function firestoreValueToJs(v) {
  if (v == null || typeof v !== 'object') return v;
  if (Object.prototype.hasOwnProperty.call(v, 'nullValue')) return null;
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

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const provided = (body.key || event.headers['x-admin-key'] || '').trim();
  const expected = (process.env.ADMIN_DASHBOARD_KEY || '').trim();
  if (!expected || provided !== expected) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
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
        error: 'Set FIREBASE_SERVICE_ACCOUNT_JSON_B64 or FIREBASE_SERVICE_ACCOUNT_JSON.',
      }),
    };
  }

  try {
    const cred = parseServiceAccountJson(saJson);
    if (!cred || !cred.private_key || !cred.client_email || !cred.project_id) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Service account JSON missing project_id, private_key, or client_email.',
        }),
      };
    }

    const accessToken = await getAccessToken(cred);
    const projectId = cred.project_id;
    const appId = getAppId();
    const apiRoot =
      'https://firestore.googleapis.com/v1/projects/' +
      projectId +
      '/databases/(default)/documents';
    const listBase = apiRoot + '/artifacts/' + encodeURIComponent(appId) + '/users';

    const userIds = [];
    let pageToken = '';
    for (;;) {
      const url = new URL(listBase);
      url.searchParams.set('pageSize', '300');
      if (pageToken) url.searchParams.set('pageToken', pageToken);
      const listRes = await fetch(url.toString(), {
        headers: { Authorization: 'Bearer ' + accessToken },
      });
      const listJson = await listRes.json().catch(function () {
        return {};
      });
      if (!listRes.ok) {
        const errMsg =
          (listJson.error && listJson.error.message) ||
          listJson.error ||
          'List users failed (' + String(listRes.status) + ')';
        throw new Error(errMsg);
      }
      const docs = listJson.documents || [];
      for (let i = 0; i < docs.length; i++) {
        const uid = userIdFromDocumentName(docs[i].name);
        if (uid) userIds.push(uid);
      }
      pageToken = listJson.nextPageToken || '';
      if (!pageToken) break;
    }

    const submissions = [];
    for (let j = 0; j < userIds.length; j++) {
      const userId = userIds[j];
      const docUrl =
        apiRoot +
        '/artifacts/' +
        encodeURIComponent(appId) +
        '/users/' +
        encodeURIComponent(userId) +
        '/quiz_results/latest';
      const docRes = await fetch(docUrl, { headers: { Authorization: 'Bearer ' + accessToken } });
      if (docRes.status === 404) continue;
      const docJson = await docRes.json().catch(function () {
        return {};
      });
      if (!docRes.ok) {
        if (docJson.error && docJson.error.code === 404) continue;
        const errMsg2 =
          (docJson.error && docJson.error.message) ||
          'Read latest failed (' + String(docRes.status) + ')';
        throw new Error(errMsg2);
      }
      const data = documentToPlain(docJson);
      const row = { firebaseUserId: userId };
      for (const key of Object.keys(data)) {
        row[key] = data[key];
      }
      submissions.push(row);
    }

    submissions.sort(function (a, b) {
      return String(b.timestamp || '').localeCompare(String(a.timestamp || ''));
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ count: submissions.length, submissions: submissions }),
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
