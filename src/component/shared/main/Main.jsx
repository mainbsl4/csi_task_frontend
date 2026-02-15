import { useState } from "react";
import FiltarAndReports from "./filtersAndReposts/FiltarAndReports";
import CurrentStatus from "./status/CurrentStatus";
import TabSection from "./tabSection/TabSection";

const Main = () => {
  const today = new Date().toISOString().split("T")[0];

  const [filters, setFilters] = useState({
    facility: "",
    zoneCode: "",
    date: today,
  });
  const [refreshTick, setRefreshTick] = useState(0);

  const handleFiltersChange = (updates) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...updates }));
  };

  const handleRefresh = () => {
    setRefreshTick((prevTick) => prevTick + 1);
  };

  return (
    <main className="w-full max-w-[1200px] mx-auto px-4 py-6 transition-all duration-300">
      <div className="flex flex-col gap-6">
        {/* filtarAndSearch */}
        <FiltarAndReports
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onRefresh={handleRefresh}
        />
        {/* statusPanel */}
        <CurrentStatus filters={filters} refreshTick={refreshTick} />
        {/* tabSection */}
        <TabSection filters={filters} refreshTick={refreshTick} />
      </div>
    </main>
  );
};

export default Main;
