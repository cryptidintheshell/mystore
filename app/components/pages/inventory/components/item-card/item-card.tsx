import { Edit, Archive, RotateCcw } from "lucide-react";

export interface Item {
	barcode: string;
	name: string;
	price: number;
	size?: string;
	amount: number;
	isArchived?: boolean;
}

interface ItemCardProps extends Item {
	onEdit?: (item: Item) => void;
	onArchive?: (barcode: string) => void;
	onUnarchive?: (barcode: string) => void;
}

export default function ItemCard({barcode, name, price, size, amount, isArchived, onEdit, onArchive, onUnarchive} : ItemCardProps) {
	return (

		<div className="flex flex-col justify-center select-none content-center rounded-xl items-center p-3 w-52 h-fit shadow-md hover:shadow-xl transition-shadow duration-500 border border-slate-200 bg-white relative group">
			
			<div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
				{!isArchived ? (
					<>
						<button 
							onClick={() => onEdit?.({barcode, name, price, size, amount, isArchived})}
							className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100"
							title="Edit"
						>
							<Edit size={16} />
						</button>
						<button 
							onClick={() => onArchive?.(barcode)}
							className="p-1.5 bg-orange-50 text-orange-600 rounded-lg border border-orange-100 hover:bg-orange-100"
							title="Archive"
						>
							<Archive size={16} />
						</button>
					</>
				) : (
					<button 
						onClick={() => onUnarchive?.(barcode)}
						className="p-1.5 bg-green-50 text-green-600 rounded-lg border border-green-100 hover:bg-green-100"
						title="Restore"
					>
						<RotateCcw size={16} />
					</button>
				)}
			</div>

			<div className="w-40 h-40 bg-gray-100 text-center content-center italic text-xl text-gray-400 rounded-lg mb-2">
				No Photo
			</div>

			<div className="w-full">
				<p className="font-bold text-slate-800 truncate" title={name}>{name}</p>
				{size && <p className="text-xs text-slate-400 mb-1">{size}</p>}

				<div className="flex justify-between items-baseline font-light text-sm">
				  <span className="text-slate-500">Price:</span>
				  <span className="font-bold text-slate-700">₱{price.toFixed(2)}</span>
				</div>

				<div className="flex justify-between items-baseline font-light text-sm">
				  <span className="text-slate-500">Amount:</span>
				  <span className="font-bold text-slate-700">{amount}</span>
				</div>

				<p className="text-[10px] text-slate-300 mt-2 font-mono">{barcode}</p>
			</div>
		</div>

	);
}