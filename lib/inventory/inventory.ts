import { adminDb } from "@/firebase/firebase-admin";

export async function getAllItems(userID: string) {
	try {
		console.log(`[DEBUG] getAllItems called for userID: ${userID}`);
		const ref = adminDb.collection("users").doc(userID).collection("inventory");
		const itemsSnapshot = await ref.get();

		if (itemsSnapshot.empty) {
			console.log(`[DEBUG] No inventory items found for userID: ${userID}`);
			return [];
		}

		const items = itemsSnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data()
		}));

		console.log(`[DEBUG] Found ${items.length} items for userID: ${userID}`);
		return items;
	} catch (error) {
		console.error("[!] Failed to get items:", error);
		throw new Error("Failed to retrieve inventory items");
	}
}


export async function getItem(userID: string, itemID: string) {
	try {
		const doc = await adminDb.collection("users").doc(userID).collection("inventory").doc(itemID).get();
		
		if (!doc.exists) {
			return null;
		}

		return {
			id: doc.id,
			...doc.data()
		};
	} catch (error) {
		console.error(`[!] Failed to get item ${itemID}:`, error);
		throw new Error("Failed to retrieve inventory item");
	}
}