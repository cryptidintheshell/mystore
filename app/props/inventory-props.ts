export interface Item {
	barcode: string;
	name: string;
	price: number;
	size?: string;
	amount: number;
	category?: string;
	sold?: number;
	isArchived?: boolean;
}

export interface InventoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (item: Partial<Item> & { barcode: string }) => Promise<void>;
	editingItem?: Item | null;
}

export interface ItemCardProps extends Item {
	onEdit?: (item: Item) => void;
	onArchive?: (barcode: string) => void;
	onUnarchive?: (barcode: string) => void;
}
