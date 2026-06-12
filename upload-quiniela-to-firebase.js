  - name: Upload Excel predictions to Firebase
        run: node --input-type=commonjs < upload-quiniela-to-firebase.js

const https = require('https');
const fs = require('fs');

// Firebase config
const PROJECT_ID = 'wc-quiniela-4d474';
const API_KEY = 'AIzaSyAE_GXAmfPbKtQsHRVZl28zitk3oYHfSWI';

// Load the predictions data
const data = JSON.parse(fs.readFileSync('./quiniela_firebase.json', 'utf8'));

function firestoreRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'firestore.googleapis.com',
      path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/${path}?key=${API_KEY}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr),
      }
    };
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode >= 400) reject(new Error(`${res.statusCode}: ${d}`));
        else resolve(JSON.parse(d));
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

function toFirestore(obj) {
  if (typeof obj === 'string') return { stringValue: obj };
  if (typeof obj === 'number') return { integerValue: obj };
  if (typeof obj === 'boolean') return { booleanValue: obj };
  if (obj === null || obj === undefined) return { nullValue: null };
  if (typeof obj === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(obj)) {
      fields[k] = toFirestore(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(obj) };
}

async function uploadAll() {
  for (const [docId, playerData] of Object.entries(data)) {
    const fields = {};
    for (const [k, v] of Object.entries(playerData)) {
      fields[k] = toFirestore(v);
    }
    try {
      await firestoreRequest(
        'PATCH',
        `excel_quiniela/${docId}`,
        { fields }
      );
      console.log(`✓ Uploaded ${playerData.name} (${playerData.email})`);
    } catch(e) {
      console.error(`✗ Failed ${playerData.name}: ${e.message}`);
    }
  }
  console.log('\nDone! All quiniela predictions are now in Firebase.');
  console.log('Collection: excel_quiniela');
}

uploadAll();
