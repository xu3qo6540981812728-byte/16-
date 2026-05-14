/**
 * Admin export: Firestore REST only (no firebase-admin).
 * Uses collection-group query on "quiz_results" so all paths like
 * artifacts/{anyAppId}/users/{uid}/quiz_results/latest are included
 * (not tied to FIREBASE_ARTIFACTS_APP_ID).
 *
 * Env: ADMIN_DASHBOARD_KEY, FIREBASE_SERVICE_ACCOUNT_JSON_B64 or FIREBASE_SERVICE_ACCOUNT_JSON.
 * FIREBASE_ARTIFACTS_APP_ID is optional (only echoed in meta for debugging).
 */
const crypto = require('crypto');

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
  if (v.bytesValue !== undefined) return v.bytesValue;
  if (v.referenceValue !== undefined) return v.referenceValue;
  if (v.geoPointValue !== undefined) return v.geoPointValue;
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

function parseUserIdFromQuizResultPath(name) {
  const parts = String(name).split('/');
  const qi = parts.lastIndexOf('quiz_results');
  if (qi >= 1) return parts[qi - 1];
  return '';
}

async function fetchSubmissionsViaCollectionGroup(accessToken, projectId) {
  const runUrl =
    'https://firestore.googleapis.com/v1/projects/' +
    projectId +
    '/databases/(default)/documents:runQuery';
  const queryBody = JSON.stringify({
    structuredQuery: {
      from: [{ collectionId: 'quiz_results', allDescendants: true }],
      limit: 5000,
    },
  });
  const res = await fetch(runUrl, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    body: queryBody,
  });
  const rawText = await res.text();
  let rows;
  try {
    rows = JSON.parse(rawText);
  } catch (e1) {
    throw new Error('runQuery response not JSON: ' + rawText.slice(0, 240));
  }
  if (!res.ok) {
    const msg =
      (rows.error && rows.error.message) ||
      rows.error ||
      'runQuery failed (' + String(res.status) + ')';
    throw new Error(msg);
  }
  if (!Array.isArray(rows)) {
    throw new Error('runQuery: unexpected response shape');
  }

  const byUserId = {};
  for (let i = 0; i < rows.length; i++) {
    const item = rows[i];
    if (!item || !item.document) continue;
    const doc = item.document;
    const name = doc.name || '';
    if (name.indexOf('/artifacts/') === -1) continue;
    if (name.indexOf('/quiz_results/latest') === -1) continue;
    const parts = name.split('/');
    if (parts[parts.length - 1] !== 'latest') continue;

    const userId = parseUserIdFromQuizResultPath(name);
    if (!userId) continue;

    const data = documentToPlain(doc);
    const row = { firebaseUserId: userId, documentPath: name };
    for (const key of Object.keys(data)) {
      row[key] = data[key];
    }

    const ts = String(row.timestamp || '');
    const prev = byUserId[userId];
    if (!prev || ts.localeCompare(String(prev.timestamp || '')) > 0) {
      byUserId[userId] = row;
    }
  }

  const submissions = [];
  const keys = Object.keys(byUserId);
  for (let k = 0; k < keys.length; k++) {
    submissions.push(byUserId[keys[k]]);
  }
  return submissions;
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

    const submissions = await fetchSubmissionsViaCollectionGroup(accessToken, projectId);

    submissions.sort(function (a, b) {
      return String(b.timestamp || '').localeCompare(String(a.timestamp || ''));
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        count: submissions.length,
        submissions: submissions,
        meta: {
          firestorePathPattern:
            'artifacts/{appId}/users/{firebaseUid}/quiz_results/latest',
          query: 'collection_group:quiz_results + filter /artifacts/ + /quiz_results/latest',
          envAppIdHint: process.env.FIREBASE_ARTIFACTS_APP_ID || 'default-app-id',
        },
      }),
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
