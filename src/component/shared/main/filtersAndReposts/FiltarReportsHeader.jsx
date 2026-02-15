const FiltarReportsHeader = ({ onRefresh }) => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4 transition-colors duration-300">
      <h2 className="m-0 text-base font-bold tracking-tight text-gray-900 dark:text-white/90">
        Filters & Reports
      </h2>
      <div className="flex flex-wrap items-center gap-2">
        <button
          id="btnRefresh"
          onClick={onRefresh}
          className="px-3 py-2 text-sm font-bold text-white bg-indigo-600 border border-indigo-400/40 rounded-xl transition-all hover:brightness-110 active:scale-95"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default FiltarReportsHeader;
