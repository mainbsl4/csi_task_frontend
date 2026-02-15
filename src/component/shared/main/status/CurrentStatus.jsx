import React from "react";

const CurrentStatus = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
      {/* Total Parking Events */}
      <article className="p-4 border shadow-xl rounded-2xl transition-all duration-300 backdrop-blur-md bg-panel-light dark:bg-panel-dark border-border-light dark:border-border-dark">
        <div className="text-xs opacity-60 uppercase text-gray-600 dark:text-white/60">
          Total Parking Events
        </div>
        <div
          className="mt-1.5 text-3xl font-black tracking-tighter text-gray-900 dark:text-white"
          id="mEvents"
        >
          1,284
        </div>
        <div className="mt-1 text-xs text-green-500 dark:text-green-400 font-medium">
          +6% vs yesterday
        </div>
      </article>

      {/* Current Occupancy */}
      <article className="p-4 border shadow-xl rounded-2xl transition-all duration-300 backdrop-blur-md bg-panel-light dark:bg-panel-dark border-border-light dark:border-border-dark">
        <div className="text-xs opacity-60 uppercase text-gray-600 dark:text-white/60">
          Current Occupancy
        </div>
        <div
          className="mt-1.5 text-3xl font-black tracking-tighter text-gray-900 dark:text-white"
          id="mOcc"
        >
          219
        </div>
        <div className="mt-1 text-xs opacity-60 text-gray-500 dark:text-white/40">
          Capacity 320
        </div>
      </article>

      {/* Active Devices */}
      <article className="p-4 border shadow-xl rounded-2xl transition-all duration-300 backdrop-blur-md bg-panel-light dark:bg-panel-dark border-border-light dark:border-border-dark">
        <div className="text-xs opacity-60 uppercase text-gray-600 dark:text-white/60">
          Active Devices
        </div>
        <div
          className="mt-1.5 text-3xl font-black tracking-tighter text-gray-900 dark:text-white"
          id="mDevices"
        >
          148
        </div>
        <div className="mt-1 text-xs opacity-60 text-gray-500 dark:text-white/40">
          Last 2 min heartbeat
        </div>
      </article>

      {/* Alerts Triggered */}
      <article className="p-4 border shadow-xl rounded-2xl transition-all duration-300 backdrop-blur-md bg-panel-light dark:bg-panel-dark border-border-light dark:border-border-dark">
        <div className="text-xs opacity-60 uppercase text-gray-600 dark:text-white/60">
          Alerts Triggered
        </div>
        <div
          className="mt-1.5 text-3xl font-black tracking-tighter text-red-600 dark:text-red-500"
          id="mAlerts"
        >
          7
        </div>
        <div className="mt-1 text-xs opacity-60 text-gray-500 dark:text-white/40">
          2 Critical • 3 Warning
        </div>
      </article>
    </section>
  );
};

export default CurrentStatus;
