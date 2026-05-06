import { PackageSearch, ArrowLeft } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import ItemCard from "./components/item-card/item-card"
import { Item } from "@/app/props/inventory-props"
import InventoryModal from "./components/inventory-modal"

export default function Inventory() {
	const [items, setItems] = useState<Item[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<Item | null>(null);
	const [viewArchived, setViewArchived] = useState(false);
	const [stocksPerCategory, setStocksPerCategory] = useState<number[]>([]);

	const fetchInventory = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`/api/inventory?archived=${viewArchived}`);
			if (!response.ok) {
				throw new Error("Failed to fetch inventory");
			}
			const data = await response.json();

			const formattedItems = data.map((item: any) => ({
				barcode: item.barcode || item.id,
				name: item.productName || item.name || "Unknown Item",
				price: item.price || 0,
				amount: item.amount || 0,
				size: item.size || "",
				category: item.category || "",
				isArchived: item.isArchived || false
			}));

			setItems(formattedItems);

			// console.log("cannedGoodsStock: ", cannedGoodsStock);

		} catch (err: any) {
			setError(err.message);
			console.error("Inventory fetch error:", err);
		} finally {
			setIsLoading(false);
		}
	}, [viewArchived]);

	useEffect(() => {
		fetchInventory();
	}, [fetchInventory]);

	const handleSave = async (itemData: Partial<Item> & { barcode: string }) => {
		const isEdit = !!editingItem;
		const url = isEdit ? `/api/inventory/${itemData.barcode}` : "/api/inventory";
		const method = isEdit ? "PATCH" : "POST";

		const body = {
			barcode: itemData.barcode,
			productName: itemData.name,
			size: itemData.size,
			price: itemData.price,
			amount: itemData.amount,
			category: itemData.category
		};

		const response = await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "Failed to save item");
		}

		await fetchInventory();
	};

	const handleArchive = async (barcode: string) => {
		if (!confirm("Are you sure you want to archive this item?")) return;

		const response = await fetch(`/api/inventory/${barcode}`, {
			method: "DELETE"
		});

		if (!response.ok) {
			alert("Failed to archive item");
			return;
		}

		await fetchInventory();
	};

	const handleUnarchive = async (barcode: string) => {
		const response = await fetch(`/api/inventory/${barcode}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ isArchived: false })
		});

		if (!response.ok) {
			alert("Failed to restore item");
			return;
		}

		await fetchInventory();
	};

	const openAddModal = () => {
		setEditingItem(null);
		setIsModalOpen(true);
	};

	const openEditModal = (item: Item) => {
		setEditingItem(item);
		setIsModalOpen(true);
	};

	return (
		<main className="bg-slate-50 h-full w-full px-5 p-3 flex flex-col gap-3">

			{/* actions */}
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-3">
					{viewArchived && (
						<button 
							onClick={() => setViewArchived(false)}
							className="p-2 hover:bg-slate-200 rounded-full transition-colors" >
							<ArrowLeft size={24} />
						</button>
					)}
					<h1 className="text-3xl font-bold text-slate-800">
						{viewArchived ? "Archived Products" : "Inventory"}
					</h1>
				</div>
				
				<div className="flex gap-2">
					{!viewArchived ? (
						<>
							<button 
								onClick={openAddModal}
								className="cursor-pointer px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-2xl shadow-sm transition-colors" >
								Add new
							</button>
							<button 
								onClick={() => setViewArchived(true)}
								className="cursor-pointer px-5 py-2 bg-orange-300 hover:bg-orange-400 text-slate-700 font-medium rounded-2xl shadow-sm transition-colors" >
								Archives
							</button>
						</>
					) : (
						<button 
							onClick={() => setViewArchived(false)}
							className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-2xl shadow-sm transition-colors"
						>
							Back to Inventory
						</button>
					)}
				</div>
			</div>


			{/* table */}
			<div className={`flex flex-wrap p-5 gap-5 w-full flex-1 overflow-y-auto rounded-2xl shadow-sm border border-slate-200 bg-white
			${(items.length === 0 || isLoading) ? "justify-center items-center" : "items-start content-start"}`}>
			
				{ isLoading ? (
					<div className="flex flex-col items-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
						<p className="mt-4 text-slate-400 font-medium">Loading inventory...</p>
					</div>
				) : error ? (
					<div className="flex flex-col items-center">
						<p className="text-red-500 font-bold text-lg">Error</p>
						<p className="italic font-light text-slate-400">{error}</p>
						<button 
							onClick={() => fetchInventory()}
							className="mt-4 px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
						>
							Try Again
						</button>
					</div>
				) : items.length === 0 ? (
					<div className="flex flex-col items-center opacity-40">
						<PackageSearch size={120} color={"#94a3b8"} />
						<p className="italic font-medium text-2xl text-slate-400">
							{viewArchived ? "No archived items" : "No items in inventory"}
						</p> 
					</div>
				) : (
					items.map((item)=> (
						<ItemCard 
							key={item.barcode} 
							{...item}
							onEdit={openEditModal}
							onArchive={handleArchive}
							onUnarchive={handleUnarchive}
						/>
					))
				)}
			</div>

			<InventoryModal 
				isOpen={isModalOpen} 
				onClose={() => setIsModalOpen(false)} 
				onSave={handleSave}
				editingItem={editingItem}
			/>

		</main>
	);
}