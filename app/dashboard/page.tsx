"use client";

import DashboardPage from "@/app/components/pages/dashboard/dashboard";
import NavigationBar from "@/app/components/navigation-bar/navigation-bar";
import SideBar from "@/app/components/sidebar/sidebar";

export default function dashboard() {
	return (
		<div className="flex flex-col h-screen">
			<NavigationBar />
			<div className="flex flex-1 overflow-hidden">
				<SideBar />
				<DashboardPage />
			</div>
		</div>
	);
}