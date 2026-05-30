"use client";

import { ProductsTable } from "../components/dashboard/ProductsTable";
import { Sidebar, Header } from "../components/dashboard/DashboardComponents";

export default function ProduitsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Produits</h1>
            <p className="text-muted-foreground">Gerez votre catalogue de produits</p>
          </div>

          <ProductsTable />
        </main>
      </div>
    </div>
  );
}
