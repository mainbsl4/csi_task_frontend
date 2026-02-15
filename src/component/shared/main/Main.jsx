import FiltarAndReports from "./filtersAndReposts/FiltarAndReports";
import CurrentStatus from "./status/CurrentStatus";
import TabSection from "./tabSection/TabSection";

const Main = () => {
  return (
    <main className="w-full max-w-[1200px] mx-auto px-4 py-6 transition-all duration-300">
      <div className="flex flex-col gap-6">
        {/* filtarAndSearch */}
        <FiltarAndReports />
        {/* statusPanel */}
        <CurrentStatus/>
        {/* tabSection */}
        <TabSection/>

      </div>
    </main>
  );
};

export default Main;
