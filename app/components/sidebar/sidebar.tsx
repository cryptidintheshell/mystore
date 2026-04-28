import { LayoutDashboard, BarChart3, Package, ShoppingCart } from "lucide-react";
import styles from "./styles.module.css";

export default function SideBar() {
	const handleOnClick = (page: string) => {
		if (!page) alert("Invalid page");
		else {
			alert(`Navigating to ${page}`);
		}
	}

	const menuItems = [
		{ name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
		{ name: "Analytics", icon: BarChart3, id: "analytics" },
		{ name: "Inventory", icon: Package, id: "inventory" },
		{ name: "POS", icon: ShoppingCart, id: "pos" },
	];

	return (
		<nav className="sticky bg-sidebar h-screen w-auto px-6 py-8 flex flex-col">
			<ul className="flex flex-col gap-4">
				{menuItems.map((item) => (
					<li 
						key={item.id}
						className={`${styles.item} flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:underline`}
						onClick={() => handleOnClick(item.id)}
					>
						<item.icon size={20} strokeWidth={2} />
						<span className="font-medium">{item.name}</span>
					</li>
				))}
			</ul>
		</nav>
	);
}