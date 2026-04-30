import { LayoutDashboard, BarChart3, Package, ShoppingCart, ScanBarcode } from "lucide-react";
import styles from "./styles.module.css";

interface SideBarProps {
	currentTab: string;
	updateTab: (tab: string) => void;
}

export default function SideBar({ currentTab, updateTab }: SideBarProps) {
	const handleOnClick = (page: string) => {
		updateTab(page);
	}

	const menuItems = [
		{ name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
		{ name: "Inventory", icon: Package, id: "inventory" },
		{ name: "POS", icon: ScanBarcode, id: "pos" },
	];

	return (
		<nav className="sticky bg-sidebar h-screen w-auto flex flex-col border-r border-white/10">
			<ul className="flex flex-col py-5 gap-2">
				{menuItems.map((item) => (
					<li key={item.id}
						className={`${styles.item} w-[200px] flex p-5 items-center gap-3 transition-colors
						${currentTab === item.id ? "bg-[#7DA78C]" : "hover:bg-red/10"} hover:no-underline`}
						onClick={() => handleOnClick(item.id)}>

						<item.icon size={20} strokeWidth={2} />
						<span className="font-medium">{item.name}</span>
					</li>
				))}
			</ul>
		</nav>
	);
}