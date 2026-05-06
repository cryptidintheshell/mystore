import { Edit, Archive, RotateCcw } from "lucide-react";
import { Item, ItemCardProps } from "@/app/props/inventory-props";

export default function ItemCard({barcode, name, price, size, amount, category, isArchived, onEdit, onArchive, onUnarchive} : ItemCardProps) {
	return (

		<div className="flex flex-col justify-center select-none content-center rounded-xl items-center p-3 w-52 h-fit shadow-md hover:shadow-xl transition-shadow duration-500 border border-slate-200 bg-white relative group">
			
			<div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
				{!isArchived ? (
					<>

						{/* on hover action buttons */}
						<button 
							onClick={() => onEdit?.({barcode, name, price, size, amount, category, isArchived})}
							className="mr-2 cursor-pointer p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100"
							title="Edit" >
							<Edit size={25} />
						</button>

						<button 
							onClick={() => onArchive?.(barcode)}
							className="mr-2 cursor-pointer p-1.5 bg-orange-50 text-orange-600 rounded-lg border border-orange-100 hover:bg-orange-100"
							title="Archive">
							<Archive size={25} />
						</button>

					</>
				) : (
					<button
						onClick={() => onUnarchive?.(barcode)}
						className="p-1.5 bg-green-100 text-green-600 cursor-pointer rounded-lg border border-green-100 hover:bg-green-200"
						title="Restore" >
						<RotateCcw size={25} />
					</button>
				)}
			</div>

			<div className="w-40 h-40 bg-gray-100 text-center content-center italic text-xl text-gray-400 rounded-lg mb-2">
				No Photo
			</div>

			<div className="w-full">
				<p className="font-bold text-slate-800 truncate" title={name}>{name}</p>
				<div className="flex justify-between items-center mb-1">
					<p className="text-xs text-slate-400">{size || <br/>}</p>
					{category && (
						<span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
							{category}
						</span>
					)}
				</div>

				<div className="flex justify-between items-baseline font-light text-md">
				  <span className="text-slate-500">Price:</span>
				  <span className="font-bold text-slate-700">₱{price.toFixed(2)}</span>
				</div>

				<div className="flex justify-between items-baseline font-light text-md">
				  <span className="text-slate-500">Amount:</span>
				  <span className="font-bold text-slate-700">{amount}</span>
				</div>

				<p className="text-md text-slate-400 mt-2 font-mono">{barcode}</p>
			</div>
		</div>

	);
}