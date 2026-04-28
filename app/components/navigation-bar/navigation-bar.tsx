export default function NavigationBar() {
	return (
		<nav className="sticky bg-navbar h-[50px] w-full flex items-center content-center justify-evenly">
			<h1 className="font-bold cursor-pointer select-none">MyStore</h1>

			{/* Settings and Account */}
			<div className="flex gap-5">
				<h2 className="cursor-pointer hover:underline select-none">Settings</h2>
				<h2 className="cursor-pointer hover:underline select-none">Account</h2>
			</div>

		</nav>
	);
}