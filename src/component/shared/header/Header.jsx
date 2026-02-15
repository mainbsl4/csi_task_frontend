const Header = () => {
  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 border-b backdrop-blur-md transition-colors duration-300 border-border-light dark:border-border-dark bg-white/50 dark:bg-black/20">
        {/* logo */}
        <div className="flex items-center gap-3">
          <div className="grid w-11 h-11 font-extrabold border place-items-center rounded-xl shadow-2xl text-xl transition-all border-border-light dark:border-border-dark bg-gradient-to-br from-indigo-500/35 to-green-500/25">
            P
          </div>
          <div>
            <div className="font-extrabold tracking-wide text-sm md:text-base text-gray-900 dark:text-white/90">
              Smart Parking Monitoring
            </div>
            <div className="text-xs opacity-60 text-gray-600 dark:text-white/60">
              Monitoring • Alerts • Efficiency
            </div>
          </div>
        </div>

        {/* userAction */}
        <div className="flex items-center gap-3">
          {/* themeToggle */}
          <button
            id="btnTheme"
            className="px-3 py-2 text-sm font-bold transition-all border rounded-xl active:translate-y-px border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-white"
            type="button"
          >
            Theme
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
