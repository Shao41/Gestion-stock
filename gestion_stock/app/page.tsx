"use client";

import { useState, useEffect } from "react";
import {
  Sidebar,
  Header,
  StatCard,
  AlertItem,
  MovementItem,
  statsData,
  alertsData,
  movementsData,
} from "./components/dashboard/DashboardComponents";
import { StockMovementChart, CategoryChart } from "./components/dashboard/Charts";
import { ProductsTable } from "./components/dashboard/ProductsTable";

function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <svg
              className="w-7 h-7 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <span className="text-3xl font-bold text-foreground">StockPro</span>
        </div>
      </div>

      {/* Loading Animation */}
      <div className="flex flex-col items-center gap-6">
        {/* Spinning Loader */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-muted rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Progress Bar */}
        <div className="w-64">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">
            Chargement des donnees... {progress}%
          </p>
        </div>

        {/* Loading Text */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
          <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></span>
          <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Tableau de bord</h1>
            <p className="text-muted-foreground">Bienvenue, voici un apercu de votre stock</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsData.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2">
              <StockMovementChart />
            </div>
            <div>
              <CategoryChart />
            </div>
          </div>

          {/* Alerts and Movements Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Low Stock Alerts */}
            <div className="bg-card rounded-xl border border-border">
              <div className="p-5 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Alertes Stock Bas</h3>
                    <p className="text-sm text-muted-foreground">Produits necessitant un reapprovisionnement</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                    {alertsData.length} alertes
                  </span>
                </div>
              </div>
              <div className="p-3 space-y-1 max-h-80 overflow-y-auto">
                {alertsData.map((alert, index) => (
                  <AlertItem key={index} {...alert} />
                ))}
              </div>
            </div>

            {/* Recent Movements */}
            <div className="bg-card rounded-xl border border-border">
              <div className="p-5 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Mouvements Recents</h3>
                    <p className="text-sm text-muted-foreground">Dernieres entrees et sorties</p>
                  </div>
                  <button className="text-sm text-primary hover:underline">
                    Voir tout
                  </button>
                </div>
              </div>
              <div className="p-3 space-y-1 max-h-80 overflow-y-auto">
                {movementsData.map((movement, index) => (
                  <MovementItem key={index} {...movement} />
                ))}
              </div>
            </div>
          </div>

          {/* Products Table */}
          <ProductsTable />
        </main>
      </div>
    </div>
  );
}
