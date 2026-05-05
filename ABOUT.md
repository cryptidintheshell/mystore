## Project overview
This project will be a sari-sari store management system witht inventory management with point of sale system.

## Project features
- Adding of inventory via scanning an item barcode (this will be in the inventory page).
- Adding of inventory via searching an item (search result will base on the global inventory of items. refer to the database structure of the project).
- Calculator during buying of items and automatic inventory (there will be a button to finalize or add all items, once all of the items are bought in the store)

## Database structure
This project uses firebase to store user details and inventory.

**Users collection structure:**
This structure will contain all of the details about the user, This would also contain a subcollection for each users about the analytics or revenue based on the selected date or overall, default will be the date during that day (this will be needed in the dashboard). 
users (collection):
	userID (document):
		email: string
		name: string
		createdAt: date
		inventory (sub collection):
			productBarcode (document):
				productName: string
				size: string
				price: int
				amount: int
			archive (sub collection, this will contain the products that runs out or removed from the inventory ):
				productBarcode (document):
					productName: string
					size: string
					price: int
					amount: int				

**Global inventory collection structure:**
My idea is there will be a collection for all of the items added by different users, but only the details of product and none about the user, so that adding of items from the user side will be easier because they would be able to just search and add that product to their inventory.
items (collection):
	productBarcode (document):
		productName: string
		size (this will be the something like "200g"): string