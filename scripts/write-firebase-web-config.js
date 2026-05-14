/**
 * Netlify 建置時：從環境變數寫入 firebase-web-config.js，供瀏覽器設定 window.__firebase_config
 *（與 Cursor 注入 __firebase_config 等效，正式站才有 Firebase。）
 *
 * 請在 Netlify Site → Environment variables 設定與 Firebase 主控台「網頁應用程式」相同的欄位：
 * FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID,
 * FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outFile = path.join(root, 'firebase-web-config.js');

const cfg = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || '',
};

const json = JSON.stringify(cfg);
const content =
  '// Generated at deploy. Do not edit by hand.\n' +
  'window.__firebase_config = ' +
  JSON.stringify(json) +
  ';\n';

fs.writeFileSync(outFile, content, 'utf8');

if (!cfg.apiKey || !cfg.projectId) {
  console.warn(
    '[write-firebase-web-config] Missing FIREBASE_API_KEY or FIREBASE_PROJECT_ID — wrote placeholder. ' +
      'Set Netlify env vars and redeploy, or use Cursor preview with injected config.'
  );
} else {
  console.log('[write-firebase-web-config] OK, projectId=' + cfg.projectId);
}
