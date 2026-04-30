"use client";

import { useState } from "react";
import DashboardPage from "@/app/components/pages/dashboard/dashboard";
import InventoryPage from "@/app/components/pages/inventory/inventory";
import PosPage from "@/app/components/pages/pos/pos";
import NavigationBar from "@/app/components/navigation-bar/navigation-bar";
import SideBar from "@/app/components/sidebar/sidebar";

export default function IndexPage() {
	const [currentTab, setCurrentTab] = useState("dashboard");

	const renderContent = () => {
		switch (currentTab) {
			case "inventory":
				return <InventoryPage />;

			case "pos":
				return <PosPage />;

			case "dashboard":
			default: return <DashboardPage />;
		}
	};

	return (
		<div className="flex flex-col h-screen overflow-hidden">
			<NavigationBar />
			<div className="flex flex-1 overflow-hidden">
				<SideBar currentTab={currentTab} updateTab={setCurrentTab} />
				<div className="flex-1 overflow-auto">
					{renderContent()}
				</div>
			</div>
		</div>
	);
}