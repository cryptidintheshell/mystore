import { PackageSearch } from "lucide-react"
import { useState, useEffect } from "react"
import ItemCard, { Item } from "./components/item-card/item-card"

export default function Inventory() {
	const [items, setItems] = useState<Item[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchInventory = async () => {
			try {
				setIsLoading(true);
				const response = await fetch("/api/inventory");
				if (!response.ok) {
					throw new Error("Failed to fetch inventory");
				}
				const data = await response.json();
				console.log(data);

				const formattedItems = data.map((item: any) => ({
					...item,
					barcode: item.barcode || item.id,
					name: item.id
				}));

				setItems(formattedItems);

			} catch (err: any) {
				setError(err.message);
				console.error("Inventory fetch error:", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchInventory();
	}, []);

	return (
		<main className="bg-slate-50 h-full w-full px-5 p-3 flex flex-col gap-3">

			{/* actions */}
			<div className="flex justify-between">
				<h1 className="text-3xl font-bold text-slate-800">Inventory</h1>
				<div className="flex gap-2">
					<div className="px-5 py-2 bg-green-200 rounded-2xl shadow-sm border border-slate-200 select-none cursor-pointer">
						Add new
					</div>
					<div className="px-5 py-2 bg-yellow-200 rounded-2xl shadow-sm border border-slate-200 select-none cursor-pointer">
						Edit product
					</div>
					<div className="px-5 py-2 bg-orange-200 rounded-2xl shadow-sm border border-slate-200 select-none cursor-pointer">
						Archives
					</div>
				</div>
			</div>


			{/* table */}
			<div className={`flex flex-wrap p-5 gap-5 w-full flex-1 overflow-y-auto text-center rounded-2xl shadow-sm border border-slate-200 
			${(items.length === 0 || isLoading) ? "justify-center items-center" : ""}`}>
			
				{ isLoading ? (
					<div className="flex flex-col items-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
						<p className="mt-4 text-gray-400">Loading inventory...</p>
					</div>
				) : error ? (
					<div className="flex flex-col items-center">
						<p className="text-red-500 font-bold">Error</p>
						<p className="italic font-light text-gray-400">{error}</p>
					</div>
				) : items.length === 0 ? (
					<div className="flex flex-col items-center">
						<PackageSearch size={80} color={"#C7C7C7"} />
						<p className="italic font-light text-2xl text-gray-400">No items</p> 
					</div>
				) : (
					items.map((item)=> (
						<ItemCard key={item.barcode} name={item.name} price={item.price} amount={item.amount} barcode={item.barcode} />
					))
				)}
			</div>

		</main>
	);
}