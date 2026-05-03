"use server";

import * as admin from "firebase-admin";
import { adminAuth, adminDb } from "@/firebase/firebase-admin";
import { createSession } from "./session/session";
import { redirect } from "next/navigation";

export async function verifyAccount(email: string) {
  // Implementation for account verification if needed
}

export async function createUser(email: string, password: string, username: string) {
  try {
    const userRecord = await adminAuth.createUser({
	    email,
	    password,
	    displayName: username,
    });

    const userRef = adminDb.collection("users").doc(); 
    const userID = userRef.id;

    await Promise.all([
      userRef.set({ 
        name: username, 
        email: email,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }),

      adminDb.collection("users").doc(userID).collection("inventory").doc("placeholder").set({
        price: 0.0,
        amount: 0,
      })
    ]);

    if (userRecord) {
      await createSession(userRecord.uid, username);
    }

  } catch (error: any) {
    if (error && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error("Failed to create user:", error);
    throw new Error(error.message || "Failed to create account");
  }

  redirect("/dashboard");
}