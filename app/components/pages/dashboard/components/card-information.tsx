import { LucideIcon } from "lucide-react";

interface CardInformationProps {
	Icon: LucideIcon;
	title: string;
	value: string;
}

export function CardInformation({ Icon, title, value }: CardInformationProps) {
	return (
		<div className="flex gap-6 bg-white p-6 rounded-xl items-center shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
			<div className="p-3 bg-blue-50 rounded-lg text-blue-600">
				<Icon size={32} />
			</div>
			<div>
				<dt className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</dt>
				<dd className="text-2xl font-bold text-slate-900 hover:cursor-pointer">{value}</dd>
			</div>
		</div>
	);
}

