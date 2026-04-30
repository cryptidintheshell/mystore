export interface Item {
	barcode: number;
	name: string;
	price: double;
	size?: string;
	amount: number;
}

export default function ItemCard({barcode, name, price, size, amount} : Item) {
	return (

		<div className="flex flex-col justify-center select-none cursor-pointer content-center rounded-xl items-center p-3 w-50 h-fit shadow-md hover:shadow-xl transition-shadow duration-500 border border-slate-200">
			<div className="w-40 h-40 bg-gray-200"></div>

			<div className="py-3">
				<p className="font-bold">{name}</p>

				<div className="flex justify-between items-baseline gap-4 font-light">
				  <span>Price:</span>
				  <span className="font-bold">{price.toFixed(2)}</span>
				</div>

				<div className="flex justify-between items-baseline gap-4 font-light">
				  <span>Amount:</span>
				  <span className="font-bold">{amount}</span>
				</div>

			</div>
		</div>

	);
}