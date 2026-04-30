"use client";
import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Item } from "../../inventory/inventory";

const Scanner = dynamic(() => import('./components/scanner/scanner'), { ssr: false });

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const isPaused = useRef(false);

  const handleScan = (decodedText: string) => {
    if (isPaused.current) return;
    isPaused.current = true;
    
    // Set a delay before allowing the next scan
    setTimeout(() => { isPaused.current = false; }, 1500);

    setItems((prevItems) => {
      const itemIndex = prevItems.findIndex(item => item.barcode === decodedText);
      
      if (itemIndex === -1) {
        return [...prevItems, { 
          barcode: decodedText, 
          name: "New Product", 
          price: 10.0, 
          amount: 1 
        }];
      } else {
        const newArr = [...prevItems];
        newArr[itemIndex] = { 
          ...newArr[itemIndex], 
          amount: newArr[itemIndex].amount + 1 
        };
        return newArr;
      }
    });
  };

  return (
    <main className="flex h-full w-full p-5 gap-5 bg-slate-50">
      {/* Left: Scanner */}
      <div className="w-1/3">
        <Scanner onResult={handleScan} />
      </div>

      {/* Right: Items List */}
      <div className="relative flex flex-col flex-1 bg-white rounded-lg shadow-xl border p-5 overflow-hidden">
        <p className="text-2xl font-bold mb-4">Scanned Items</p>
        
        <div className="flex-1 overflow-y-auto mb-20">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-200">
                <th className="p-2">Barcode</th>
                <th className="p-2">Item</th>
                <th className="p-2">Price</th>
                <th className="p-2">Qty</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.barcode + i} className="border-b">
                  <td className="p-2 font-mono text-sm">{item.barcode}</td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">${item.price.toFixed(2)}</td>
                  <td className="p-2 font-bold">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fixed Buttons */}
        <div className="absolute bottom-0 left-0 w-full p-5 bg-white border-t flex gap-3">
          <button className="cursor-pointer flex-1 p-4 bg-red-200 hover:bg-red-300 rounded-lg transition-all shadow-xl font-bold">Cancel</button>
          <button className="cursor-pointer flex-1 p-4 bg-green-200 hover:bg-green-300 rounded-lg transition-all shadow-xl font-bold">Checkout</button>
        </div>
      </div>
    </main>
  );
}