import FiltarReportsHeader from "./FiltarReportsHeader";
import FiltarsInpus from "./FiltarsInpus";

const FiltarAndReports = () => {
  return (
    <section
      className="p-5 rounded-2xl border transition-all duration-500
                 backdrop-blur-md shadow-2xl
                 
                 dark:bg-white/5 dark:border-white/10 dark:shadow-black/40
                 
                 light:bg-white/70 light:border-black/5 light:shadow-gray-200/50"
    >
      <FiltarReportsHeader />

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4"></div>

      <div className="mt-2">
        <FiltarsInpus />
      </div>
    </section>
  );
};

export default FiltarAndReports;
