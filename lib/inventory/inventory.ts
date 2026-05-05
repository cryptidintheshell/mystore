import { adminDb } from "@/firebase/firebase-admin";

export async function getAllItems(userID: string, archived: boolean = false) {
	try {
		console.log(`[DEBUG] getAllItems called for userID: ${userID}, archived: ${archived}`);
		const ref = adminDb.collection("users").doc(userID).collection("inventory");
		const itemsSnapshot = await ref.where("isArchived", "==", archived).get();

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

export async function addItem(userID: string, barcode: string, data: { productName: string, size: string, price: number, amount: number }
): Promise<{ success: boolean; error?: string }> {
	if (!userID || !barcode || !data.productName) {
		return { success: false, error: "Missing required fields: userID, barcode, or productName" };
	}
	if (data.price < 0) {
		return { success: false, error: "Price cannot be negative" };
	}
	if (!Number.isInteger(data.amount) || data.amount < 0) {
		return { success: false, error: "Amount must be a non-negative integer" };
	}

	try {
		await adminDb.collection("users").doc(userID).collection("inventory").doc(barcode).set({
			barcode,
			productName: data.productName,
			size: data.size || "",
			price: data.price,
			amount: data.amount,
			isArchived: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});

		const productDoc = adminDb.collection("items").doc(barcode).get();
		if (!productDoc.exists) {
			await adminDb.collection("items").doc(barcode).set({
				barcode,
				productName: data.productName,
				size: data.size || "",
				price: data.price,
				createdAt: new Date().toISOString(),
			});			
		}

		return { success: true };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error occurred";
		console.error(`Failed to add item for user ${userID}:`, message);
		return { success: false, error: message };
	}
}

export async function updateItem(userID: string, barcode: string, data: Partial<{ productName: string, size: string, price: number, amount: number, isArchived: boolean }>
): Promise<{ success: boolean; error?: string }> {
	try {
		const updateData = {
			...data,
			updatedAt: new Date().toISOString(),
		};
		await adminDb.collection("users").doc(userID).collection("inventory").doc(barcode).update(updateData);
		return { success: true };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error occurred";
		console.error(`Failed to update item ${barcode} for user ${userID}:`, message);
		return { success: false, error: message };
	}
}

export async function archiveItem(userID: string, barcode: string): Promise<{ success: boolean; error?: string }> {
	return updateItem(userID, barcode, { isArchived: true });
}

export async function searchGlobalItems(query: string) {
	try {
		// This is a simple prefix search for productName
		// Firestore doesn't support full-text search natively without extensions
		// For a sari-sari store, prefix or exact match might be enough or we fetch all and filter (if small)
		const snapshot = await adminDb.collection("items")
			.where("productName", ">=", query)
			.where("productName", "<=", query + "\uf8ff")
			.limit(10)
			.get();

		return snapshot.docs.map(doc => ({
			barcode: doc.id,
			...doc.data()
		}));
	} catch (error) {
		console.error("Failed to search global items:", error);
		throw new Error("Failed to search global items");
	}
}

export async function getGlobalItem(barcode: string) {
	try {
		const doc = await adminDb.collection("items").doc(barcode).get();
		if (!doc.exists) return null;
		return {
			barcode: doc.id,
			...doc.data()
		};
	} catch (error) {
		console.error("Failed to get global item:", error);
		throw new Error("Failed to get global item");
	}
}