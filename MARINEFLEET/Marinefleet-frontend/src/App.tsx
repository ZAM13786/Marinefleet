// File: src/App.tsx

import { useState } from "react";
import { RoutesPage } from "./adapter/ui/pages/RoutesPage";
import { ComparePage } from "./adapter/ui/pages/ComparePage";
import { BankingPage } from "./adapter/ui/pages/BankingPage";
import { PoolingPage } from "./adapter/ui/pages/PoolingPage";
import { ErrorBoundary } from "./adapter/ui/components/ErrorBoundary";

type TabName = "Routes" | "Compare" | "Banking" | "Pooling";

const TABS: { name: TabName; label: string }[] = [
  { name: "Routes", label: "Routes" },
  { name: "Compare", label: "Compare" },
  { name: "Banking", label: "Banking" },
  { name: "Pooling", label: "Pooling" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>("Routes");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Routes":
        return <RoutesPage />;
      case "Compare":
        return <ComparePage />;
      case "Banking":
        return <BankingPage />;
      case "Pooling":
        return <PoolingPage />;
      default:
        return <RoutesPage />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4 max-w-7xl">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Marine Fleet Management</h1>
            <p className="text-gray-600">Compliance, Banking, and Pooling Management System</p>
          </header>

          {/* Tab Navigation */}
          <nav className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <ul className="flex flex-wrap -mb-px">
              {TABS.map((tab) => (
                <li key={tab.name}>
                  <button
                    onClick={() => setActiveTab(tab.name)}
                    className={`inline-block px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.name
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Tab Content */}
          <main className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <ErrorBoundary>
              {renderTabContent()}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}