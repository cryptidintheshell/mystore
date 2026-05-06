import { Package, AlertTriangle, DollarSign, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { useState, useEffect, useCallback } from "react"
import { CardInformation } from "./components/card-information";
import { Item } from "@/app/props/inventory-props";

interface CategoryStock {
	category: string;
	totalStock: number;
}

export default function Dashboard() {
	const [inventoryCount, setInventoryCount] = useState<string | number>("Loading");
	const [inventoryItems, setInventoryItems] = useState<Item[]>([]);
	const [lowStocks, setLowStocks] = useState<Item[]>([]);
	const [categoryStocks, setCategoryStocks] = useState<CategoryStock[]>([]);
	const [sales, setSales] = useState(0);
	const [topSeller, setTopSeller] = useState<Item[]>([]);
	const [isRetrievingInventory, setIsRetrievingInventory] = useState(true);


	const getInventoryCount = useCallback(async ()=> {
		try {
			const response = await fetch("/api/inventory");
			if (!response.ok) {
				console.error("[!] Failed to get inventory");
				setInventoryCount("Failed");
				return;
			}

			// products
			const inventoryData = await response.json();
			if (!inventoryData) {
				setInventoryCount("Failed");
				return;
			}

			const formattedItems: Item[] = inventoryData.map((item: any) => ({
				barcode: item.barcode || item.id,
				name: item.productName || item.name || "Unknown Item",
				price: item.price || 0,
				amount: item.amount || 0,
				size: item.size || "",
				category: item.category || "Uncategorized",
				sold: item.sold || 0,
				isArchived: item.isArchived || false
			}));

			// store inventory items
			setInventoryItems(formattedItems);
			setLowStocks(formattedItems.filter(item => item.amount < 3));
			setTopSeller(formattedItems.filter(item => (item.sold || 0) > 10));

			// Calculate stocks per category
			const categoryMap: Record<string, number> = {};
			formattedItems.forEach(item => {
				const cat = item.category || "Uncategorized";
				categoryMap[cat] = (categoryMap[cat] || 0) + item.amount;
			});
			
			const categoryData = Object.entries(categoryMap).map(([category, totalStock]) => ({
				category,
				totalStock
			})).sort((a, b) => b.totalStock - a.totalStock);
			
			setCategoryStocks(categoryData);

			setIsRetrievingInventory(false);
			setInventoryCount(formattedItems.length);
		} catch (error) {
			console.error("Error fetching inventory:", error);
			setInventoryCount("Error");
		}
	}, []);

	useEffect(()=> {
		getInventoryCount();
	}, [getInventoryCount]);

	return (
		<main className="bg-slate-50 h-full w-full p-4 overflow-y-auto">
			<h1 className="text-3xl font-bold mb-8 text-slate-800">Overview</h1>

			{/* Metrics Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
				<CardInformation
					Icon={Package}
					title="Total Products"
					value={isRetrievingInventory ? "Loading" : inventoryCount}
				/>
				<CardInformation
					Icon={AlertTriangle}
					title="Low Stock"
					value={isRetrievingInventory ? "Loading" : lowStocks.length}
				/>
				<CardInformation
					Icon={DollarSign}
					title="Total Value"
					value={isRetrievingInventory ? "Loading" : sales}
				/>
				<CardInformation
					Icon={TrendingUp}
					title="Top Seller"
					value={isRetrievingInventory ? "Loading" : (topSeller.length < 1) ? "No product" : topSeller[0].name}
				/>
			</div>

			{/* Analytics Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
				<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
					<div className="flex items-center gap-2 mb-6">
						<BarChart3 className="text-blue-600" size={20} />
						<h2 className="text-xl font-semibold text-slate-700">Stock Levels by Category</h2>
					</div>
					<div className="h-64 w-full flex items-end justify-around pb-2 border-b border-slate-200 gap-2 px-2">
						{isRetrievingInventory ? (
							<div className="w-full h-full flex items-center justify-center text-slate-400">Loading...</div>
						) : categoryStocks.length === 0 ? (
							<div className="w-full h-full flex items-center justify-center text-slate-400">No data</div>
						) : (
							categoryStocks.slice(0, 8).map((cat) => {
								const maxStock = Math.max(...categoryStocks.map(c => c.totalStock), 1);
								const height = (cat.totalStock / maxStock) * 100;
								return (
									<div 
										key={cat.category}
										className="flex-1 max-w-[48px] bg-blue-500 rounded-t-md transition-all hover:bg-blue-600 relative group" 
										style={{ height: `${Math.max(height, 5)}%` }}
									>
										<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
											{cat.totalStock} units
										</div>
									</div>
								);
							})
						)}
					</div>
					<div className="flex justify-around mt-4 text-[10px] text-slate-500 font-medium uppercase tracking-wider">
						{categoryStocks.slice(0, 8).map(cat => (
							<span key={cat.category} className="flex-1 text-center truncate px-1" title={cat.category}>
								{cat.category}
							</span>
						))}
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
					<div className="flex items-center gap-2 mb-6">
						<PieChart className="text-blue-600" size={20} />
						<h2 className="text-xl font-semibold text-slate-700">Inventory Distribution</h2>
					</div>
					<div className="h-64 w-full flex items-center justify-center">
						{isRetrievingInventory ? (
							<div className="text-slate-400">Loading...</div>
						) : categoryStocks.length === 0 ? (
							<div className="text-slate-400">No data</div>
						) : (
							<>
								{/* Simplified Pie Chart Placeholder using SVG */}
								<svg viewBox="0 0 32 32" className="w-48 h-48 transform -rotate-90">
									<circle r="16" cx="16" cy="16" fill="#f1f5f9" />
									{categoryStocks.slice(0, 3).map((cat, i) => {
										const total = categoryStocks.reduce((acc, c) => acc + c.totalStock, 0);
										const percentage = (cat.totalStock / total) * 100;
										let offset = 0;
										for (let j = 0; j < i; j++) {
											offset += (categoryStocks[j].totalStock / total) * 100;
										}
										const colors = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];
										return (
											<circle 
												key={cat.category}
												r="16" cx="16" cy="16" 
												fill="transparent" 
												stroke={colors[i % colors.length]} 
												strokeWidth="32" 
												strokeDasharray={`${percentage} 100`} 
												strokeDashoffset={-offset} 
											/>
										);
									})}
								</svg>
								<div className="ml-8 space-y-2 max-w-[150px]">
									{categoryStocks.slice(0, 4).map((cat, i) => {
										const total = categoryStocks.reduce((acc, c) => acc + c.totalStock, 0);
										const percentage = Math.round((cat.totalStock / total) * 100);
										const colors = ["bg-blue-500", "bg-blue-400", "bg-blue-300", "bg-blue-200"];
										return (
											<div key={cat.category} className="flex items-center gap-2">
												<div className={`w-3 h-3 ${colors[i % colors.length]} rounded-full shrink-0`}></div>
												<span className="text-xs text-slate-600 truncate">{cat.category} ({percentage}%)</span>
											</div>
										);
									})}
									{categoryStocks.length > 4 && (
										<div className="flex items-center gap-2">
											<div className="w-3 h-3 bg-slate-200 rounded-full shrink-0"></div>
											<span className="text-xs text-slate-600">Others</span>
										</div>
									)}
								</div>
							</>
						)}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Recent Movements */}
				<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
					<h2 className="text-xl font-semibold mb-4 text-slate-700">Stock Levels</h2>
					<div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
						{inventoryItems.slice(0, 10).map((item) => (
							<div key={item.barcode} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0">
								<div>
									<p className="font-medium text-slate-800">{item.name}</p>
									<p className="text-[10px] text-slate-500 uppercase">{item.category}</p>
								</div>
								<span className={`font-semibold ${item.amount < 5 ? 'text-red-600' : 'text-slate-600'}`}>{item.amount}</span>
							</div>
						))}
						{inventoryItems.length === 0 && <p className="text-slate-400 text-center py-4">No inventory items</p>}
					</div>
				</div>

				{/* Low Stock Alerts */}
				<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
					<h2 className="text-xl font-semibold mb-4 text-slate-700">Low Stock Alerts</h2>
					<div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
						{lowStocks.map((item) => (
							<div key={item.barcode} className="flex justify-between items-center bg-red-50 p-3 rounded-lg">
								<div className="flex items-center gap-3">
									<AlertTriangle className="text-red-500" size={20} />
									<div>
										<p className="font-medium text-red-800">{item.name}</p>
										<p className="text-xs text-red-600">Only {item.amount} left</p>
									</div>
								</div>
								<button className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
									Restock
								</button>
							</div>
						))}
						{lowStocks.length === 0 && (
							<div className="flex flex-col items-center justify-center py-8 text-slate-400">
								<Package className="mb-2 opacity-20" size={48} />
								<p>No low stock alerts</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}