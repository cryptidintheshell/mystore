import { Package, AlertTriangle, DollarSign, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { CardInformation } from "./components/card-information";

export default function Dashboard() {
	return (
		<main className="bg-slate-50 h-full w-full p-8 overflow-y-auto">
			<h1 className="text-3xl font-bold mb-8 text-slate-800">Inventory Overview</h1>

			{/* Metrics Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
				<CardInformation
					Icon={Package}
					title="Total Products"
					value="1,234"
				/>
				<CardInformation
					Icon={AlertTriangle}
					title="Low Stock"
					value="12 items"
				/>
				<CardInformation
					Icon={DollarSign}
					title="Total Value"
					value="$45,200"
				/>
				<CardInformation
					Icon={TrendingUp}
					title="Top Seller"
					value="Widget X"
				/>
			</div>

			{/* Analytics Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
				<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
					<div className="flex items-center gap-2 mb-6">
						<BarChart3 className="text-blue-600" size={20} />
						<h2 className="text-xl font-semibold text-slate-700">Stock Levels by Category</h2>
					</div>
					<div className="h-64 w-full flex items-end justify-around pb-2 border-b border-slate-200">
						{/* Bar Chart Placeholder */}
						<div className="w-12 bg-blue-500 rounded-t-md transition-all hover:bg-blue-600" style={{ height: '70%' }}></div>
						<div className="w-12 bg-blue-400 rounded-t-md transition-all hover:bg-blue-500" style={{ height: '45%' }}></div>
						<div className="w-12 bg-blue-300 rounded-t-md transition-all hover:bg-blue-400" style={{ height: '90%' }}></div>
						<div className="w-12 bg-blue-500 rounded-t-md transition-all hover:bg-blue-600" style={{ height: '30%' }}></div>
						<div className="w-12 bg-blue-400 rounded-t-md transition-all hover:bg-blue-500" style={{ height: '60%' }}></div>
					</div>
					<div className="flex justify-around mt-4 text-xs text-slate-500 font-medium uppercase tracking-wider">
						<span>Cat A</span>
						<span>Cat B</span>
						<span>Cat C</span>
						<span>Cat D</span>
						<span>Cat E</span>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
					<div className="flex items-center gap-2 mb-6">
						<PieChart className="text-blue-600" size={20} />
						<h2 className="text-xl font-semibold text-slate-700">Inventory Distribution</h2>
					</div>
					<div className="h-64 w-full flex items-center justify-center">
						{/* Pie Chart Placeholder using SVG */}
						<svg viewBox="0 0 32 32" className="w-48 h-48 transform -rotate-90">
							<circle r="16" cx="16" cy="16" fill="#f1f5f9" />
							<circle r="16" cx="16" cy="16" fill="transparent" stroke="#3b82f6" strokeWidth="32" strokeDasharray="65 100" />
							<circle r="16" cx="16" cy="16" fill="transparent" stroke="#60a5fa" strokeWidth="32" strokeDasharray="25 100" strokeDashoffset="-65" />
							<circle r="16" cx="16" cy="16" fill="transparent" stroke="#93c5fd" strokeWidth="32" strokeDasharray="10 100" strokeDashoffset="-90" />
						</svg>
						<div className="ml-8 space-y-2">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
								<span className="text-sm text-slate-600">Electronics (65%)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 bg-blue-400 rounded-full"></div>
								<span className="text-sm text-slate-600">Furniture (25%)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 bg-blue-300 rounded-full"></div>
								<span className="text-sm text-slate-600">Others (10%)</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Recent Activity Table Placeholder */}
				<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
					<h2 className="text-xl font-semibold mb-4 text-slate-700">Recent Movements</h2>
					<div className="space-y-4">
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0">
								<div>
									<p className="font-medium text-slate-800">Product {i}</p>
									<p className="text-sm text-slate-500 text-xs">Stock Added</p>
								</div>
								<span className="text-green-600 font-semibold">+20</span>
							</div>
						))}
					</div>
				</div>

				{/* Low Stock Alerts Placeholder */}
				<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
					<h2 className="text-xl font-semibold mb-4 text-slate-700">Low Stock Alerts</h2>
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex justify-between items-center bg-red-50 p-3 rounded-lg">
								<div className="flex items-center gap-3">
									<AlertTriangle className="text-red-500" size={20} />
									<div>
										<p className="font-medium text-red-800">Critical Item {i}</p>
										<p className="text-xs text-red-600">Only 2 left</p>
									</div>
								</div>
								<button className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
									Restock
								</button>
							</div>
						))}
					</div>
				</div>
			</div>
		</main>
	);
}