/**
 * 管理者匯出：讀取 Firestore `artifacts/{appId}/users/*/quiz_results/latest`
 *
 * Netlify 環境變數：
 * - ADMIN_DASHBOARD_KEY：管理介面呼叫 API 時使用的密鑰（請設為強隨機字串）
 * - FIREBASE_SERVICE_ACCOUNT_JSON：Firebase 服務帳戶 JSON 的「整段」字串（專案設定 → 服務帳戶 → 金鑰）
 * - FIREBASE_ARTIFACTS_APP_ID：（選用）須與前端 `__app_id` 一致，預設 default-app-id
 */
const admin = require('firebase-admin');

function getAppId() {
  return process.env.FIREBASE_ARTIFACTS_APP_ID || 'default-app-id';
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

  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!saJson) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'FIREBASE_SERVICE_ACCOUNT_JSON is not configured' }),
    };
  }

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(saJson)),
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
