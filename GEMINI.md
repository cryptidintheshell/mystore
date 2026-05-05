# Project: MyStore - Sari-Sari Store Management System

## Overview
MyStore is a comprehensive management system for sari-sari stores, featuring inventory management and a Point of Sale (POS) system. It allows users to track stock, scan items for quick entry, and process sales with automatic inventory updates.

## Project Features
- **Inventory via Scanning:** Users can add items to their inventory by scanning barcodes directly on the inventory page.
- **Inventory via Search:** Users can search for items. Search results are pulled from the **Global Items Collection** to make adding common products faster and easier.
- **POS Calculator:** A dedicated calculator for the buying process. It includes a "finalize" or "add all" button to process multiple items at once and automatically update inventory levels.
- **Analytics Dashboard:** A dashboard providing insights into revenue and sales analytics.

## Technical Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database/Auth:** Firebase (Firestore)
- **Styling:** Tailwind CSS 4
- **Key Libraries:** 
  - `html5-qrcode`: For barcode scanning in the inventory and POS pages.
  - `firebase-admin`: For server-side operations and API routes.
  - `react-firebase-hooks`: For real-time client-side data syncing.
  - `jose`: For session management.

## Database Schema (Firestore)

### Users Collection
Stores user profiles, their specific store inventory, and sales analytics.
- `users/{userID}`
  - `email`: string
  - `name`: string
  - `createdAt`: timestamp
  - **Sub-collection: `inventory`**
    - `inventory/{productBarcode}`
      - `productName`: string
      - `size`: string (e.g., "200g", "1L")
      - `price`: number (integer)
      - `amount`: number (integer)
      - **Sub-collection: `archive`**
	    - `archive/{productBarcode}`
	      - `productName`: string
	      - `size`: string (e.g., "200g", "1L")
	      - `price`: number (integer)
	      - `amount`: number (integer)      	
  - **Sub-collection: `analytics`** (or `revenue`)
    - Stores revenue data based on selected dates or overall totals. The default view should be for the current day.

### Global Items Collection
A shared database of product details (no user-specific data like price/stock) to simplify item addition.
- `items/{productBarcode}`
  - `productName`: string
  - `size`: string

## Rules & Conventions
1. **Proxy vs Middleware:** Do NOT change the `proxy.ts` file to `middleware.ts`. The project uses a custom proxy implementation.
2. **Server Logic:** Use `firebase-admin` for all logic within API routes (`app/api/...`) and Server Actions (`lib/actions.ts`).
3. **Client Logic:** Use `firebase-client` and `react-firebase-hooks` for UI-driven data fetching.
4. **Consistency:** Ensure all inventory updates (Add/Edit/Sale) correctly reflect in the user's sub-collection while maintaining the integrity of the global `items` collection.
5. **Types:** Always use TypeScript interfaces/types that match the database schema defined above.