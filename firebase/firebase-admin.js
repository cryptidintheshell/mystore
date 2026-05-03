import * as admin from 'firebase-admin';

function getAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.error('CRITICAL: Firebase Admin environment variables are missing.');
    throw new Error('Firebase Admin initialization failed: Missing environment variables (PROJECT_ID, CLIENT_EMAIL, or PRIVATE_KEY).');
  }

  // Handle potential quoting issues and newline escaping
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.substring(1, privateKey.length - 1);
  }

  // If it's a JSON string (sometimes the whole service account is passed), parse it
  if (privateKey.startsWith('{')) {
    try {
      const serviceAccount = JSON.parse(privateKey);
      if (serviceAccount.private_key) {
        privateKey = serviceAccount.private_key;
      }
    } catch (e) {
      // Not a JSON or malformed, continue with original string
    }
  }

  privateKey = privateKey.replace(/\\n/g, '\n');

  try {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    throw error;
  }
}

// Initialize the app if it hasn't been already
getAdminApp();

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
