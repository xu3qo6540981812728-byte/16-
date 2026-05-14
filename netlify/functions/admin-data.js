/**
 * 管理者匯出：讀取 Firestore `artifacts/{appId}/users/*/quiz_results/latest`
 *
 * Netlify 環境變數：
 * - ADMIN_DASHBOARD_KEY：管理介面呼叫 API 時使用的密鑰（請設為強隨機字串）
 * - FIREBASE_SERVICE_ACCOUNT_JSON_B64：（建議）服務帳戶 JSON 經 Base64 編碼後的「單行」字串，最適合貼在 Netlify UI
 * - FIREBASE_SERVICE_ACCOUNT_JSON：整段 JSON 字串（單行較不易出錯）；若同時設定 B64，以 B64 為準
 * - FIREBASE_ARTIFACTS_APP_ID：（選用）須與前端 `__app_id` 一致，預設 default-app-id
 */
const admin = require('firebase-admin');

function getAppId() {
  return process.env.FIREBASE_ARTIFACTS_APP_ID || 'default-app-id';
}

/**
 * 優先讀 Base64（Netlify 多行 JSON 常貼失敗）；否則讀純 JSON 字串。
 */
function getServiceAccountJsonString() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;
  if (b64 && String(b64).trim()) {
    try {
      return Buffer.from(String(b64).replace(/\s/g, ''), 'base64').toString('utf8');
    } catch {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_JSON_B64 解碼失敗。請用 PowerShell 產生單行 Base64 後整段貼入（勿含換行）。'
      );
    }
  }
  return String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '').trim();
}

function parseServiceAccountJson(raw) {
  const trimmed = String(raw ?? '').trim().replace(/^\uFEFF/, '');
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    const err = new Error(
      '服務帳戶內容不是合法 JSON。建議改用 FIREBASE_SERVICE_ACCOUNT_JSON_B64；或將 JSON 壓成單行後再貼 FIREBASE_SERVICE_ACCOUNT_JSON。'
    );
    err.cause = e;
    throw err;
  }
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
        error:
          '未設定服務帳戶。請在 Netlify 新增 FIREBASE_SERVICE_ACCOUNT_JSON_B64（建議）或 FIREBASE_SERVICE_ACCOUNT_JSON。',
      }),
    };
  }

  try {
    if (!admin.apps.length) {
      const cred = parseServiceAccountJson(saJson);
      if (!cred || !cred.private_key || !cred.client_email) {
        return {
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: '服務帳戶 JSON 缺少 private_key 或 client_email，請確認金鑰檔完整且未截斷。',
          }),
        };
      }
      admin.initializeApp({
        credential: admin.credential.cert(cred),
      });
    }
    const db = admin.firestore();
    const appId = getAppId();
    const usersSnap = await db.collection('artifacts').doc(appId).collection('users').get();

    const submissions = [];
    for (const userDoc of usersSnap.docs) {
      const latestSnap = await userDoc.ref.collection('quiz_results').doc('latest').get();
      if (!latestSnap.exists) continue;
      submissions.push({
        firebaseUserId: userDoc.id,
        ...latestSnap.data(),
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
