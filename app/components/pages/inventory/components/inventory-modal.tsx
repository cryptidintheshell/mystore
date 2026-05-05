"use client";
import { useState, useEffect } from "react";
import Scanner from "../../pos/components/scanner/scanner";
import { Item } from "./item-card/item-card";
import { Search } from "lucide-react";

interface InventoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (item: Partial<Item> & { barcode: string }) => Promise<void>;
	editingItem?: Item | null;
}

export default function InventoryModal({ isOpen, onClose, onSave, editingItem }: InventoryModalProps) {
	const [barcode, setBarcode] = useState("");
	const [productName, setProductName] = useState("");
	const [size, setSize] = useState("");
	const [price, setPrice] = useState<number>(0);
	const [amount, setAmount] = useState<number>(0);
	const [isScanning, setIsScanning] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	useEffect(() => {
		if (editingItem) {
			setBarcode(editingItem.barcode);
			setProductName(editingItem.name);
			setSize(editingItem.size || "");
			setPrice(editingItem.price);
			setAmount(editingItem.amount);
		} else {
			setBarcode("");
			setProductName("");
			setSize("");
			setPrice(0);
			setAmount(0);
		}
		setSearchQuery("");
		setSearchResults([]);
	}, [editingItem, isOpen]);

	const handleSearch = async (query: string) => {
		setSearchQuery(query);
		if (query.length < 2) {
			setSearchResults([]);
			return;
		}

		setIsSearching(true);
		try {
			const response = await fetch(`/api/items?q=${encodeURIComponent(query)}`);
			if (response.ok) {
				const data = await response.json();
				setSearchResults(data);
			}
		} catch (error) {
			console.error("Search error:", error);
		} finally {
			setIsSearching(false);
		}
	};

	const selectGlobalItem = (item: any) => {
		setBarcode(item.barcode);
		setProductName(item.productName);
		setSize(item.size || "");
		setSearchResults([]);
		setSearchQuery("");
	};

	const fetchGlobalByBarcode = async (code: string) => {
		try {
			// We can use the same search API or create a specific one
			const response = await fetch(`/api/items?q=${encodeURIComponent(code)}`); // This might not work if q is name only
			// Let's assume we might need a specific barcode lookup or search works for both
			// For now, let's just stick to the current implementation or add a barcode check
		} catch (error) {
			console.error("Barcode lookup error:", error);
		}
	};

	if (!isOpen) return null;

	const handleScanResult = (result: string) => {
		setBarcode(result);
		setIsScanning(false);
		// Optionally fetch global data here
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		try {
			await onSave({
				barcode,
				name: productName,
				size,
				price,
				amount
			});
			onClose();
		} catch (error) {
			console.error("Save error:", error);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
				<div className="p-6 border-b border-slate-100 flex justify-between items-center">
					<h2 className="text-xl font-bold text-slate-800">
						{editingItem ? "Edit Product" : "Add New Product"}
					</h2>
					<button onClick={onClose} className="text-slate-400 rounded-full hover:text-slate-600 hover:bg-red-200 p-2 cursor-pointer">✕</button>
				</div>

				<div className="flex-1 overflow-y-auto">
					{!editingItem && !isScanning && (
						<div className="px-6 pt-4">
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Search size={18} className="text-slate-400" />
								</div>
								<input 
									type="text" 
									placeholder="Search global items..."
									value={searchQuery}
									onChange={(e) => handleSearch(e.target.value)}
									className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
								/>
								{isSearching && (
									<div className="absolute right-3 top-2.5">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
									</div>
								)}
							</div>

							{searchResults.length > 0 && (
								<div className="absolute z-10 mt-1 w-100 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
									{searchResults.map((item) => (
										<div 
											key={item.barcode}
											onClick={() => selectGlobalItem(item)}
											className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
										>
											<p className="text-sm font-medium text-slate-700">{item.productName}</p>
											<p className="text-[10px] text-slate-400">{item.size} • {item.barcode}</p>
										</div>
									))}
								</div>
							)}
						</div>
					)}

					<form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
						{isScanning ? (
							<div className="flex flex-col gap-2">
								<Scanner onResult={handleScanResult} />
								<button 
									type="button" 
									onClick={() => setIsScanning(false)}
									className="py-2 text-red-500 font-medium text-sm"
								>
									Cancel Scanning
								</button>
							</div>
						) : (
							<>
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Barcode</label>
									<div className="flex gap-2">
										<input 
											type="text" 
											value={barcode} 
											onChange={(e) => setBarcode(e.target.value)}
											className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm"
											required
											disabled={!!editingItem}
										/>
										{!editingItem && (
											<button 
												type="button"
												onClick={() => setIsScanning(true)}
												className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 font-medium text-sm hover:bg-blue-100"
											>
												Scan
											</button>
										)}
									</div>
								</div>

								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Name</label>
									<input 
										type="text" 
										value={productName} 
										onChange={(e) => setProductName(e.target.value)}
										className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm"
										required
									/>
								</div>

								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Size (e.g. 200g, 1L)</label>
									<input 
										type="text" 
										value={size} 
										onChange={(e) => setSize(e.target.value)}
										className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm"
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="flex flex-col gap-1">
										<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Price (₱)</label>
										<input 
											type="number" 
											step="0.01"
											value={price} 
											onChange={(e) => setPrice(parseFloat(e.target.value))}
											className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm"
											required
										/>
									</div>
									<div className="flex flex-col gap-1">
										<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Amount</label>
										<input 
											type="number" 
											value={amount} 
											onChange={(e) => setAmount(parseInt(e.target.value))}
											className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm"
											required
										/>
									</div>
								</div>

								<div className="mt-4 flex gap-3">
									<button 
										type="button"
										onClick={onClose}
										className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium text-sm hover:bg-slate-50"
									>
										Cancel
									</button>
									<button 
										type="submit"
										disabled={isSaving}
										className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm shadow-md shadow-blue-100 hover:bg-blue-700 disabled:bg-blue-400"
									>
										{isSaving ? "Saving..." : editingItem ? "Update Product" : "Add to Inventory"}
									</button>
								</div>
							</>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}

