import React, { useEffect, useState } from "react";
import { getDashboardSummary } from "../../../../api/dashboard";

const DEFAULT_SUMMARY = {
  total_parking_events: 0,
  current_occupancy_count: 0,
  active_devices_count: 0,
  alerts_triggered_count: 0,
  target_parking_events: 0,
  efficiency: 0,
  zone_wise_indicators: {},
};

const formatNumber = (value) => {
  const numericValue = Number(value ?? 0);
  return new Intl.NumberFormat().format(Number.isFinite(numericValue) ? numericValue : 0);
};

const formatPercent = (value) => `${Number(value ?? 0).toFixed(1)}%`;

const CurrentStatus = ({ filters, refreshTick }) => {
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  useEffect(() => {
    const abortController = new AbortController();

    const loadSummary = async () => {
      try {
        setIsSummaryLoading(true);
        setSummaryError("");

        const data = await getDashboardSummary({
          date: filters?.date || undefined,
          facility: filters?.facility || undefined,
          zoneCode: filters?.zoneCode || undefined,
          signal: abortController.signal,
        });

        setSummary({ ...DEFAULT_SUMMARY, ...(data || {}) });
      } catch (error) {
        if (error.name !== "AbortError") {
          setSummaryError("Unable to load dashboard summary");
        }
      } finally {
        setIsSummaryLoading(false);
      }
    };

    loadSummary();

    return () => abortController.abort();
  }, [filters?.date, filters?.facility, filters?.zoneCode, refreshTick]);

  const zoneIndicator = filters?.zoneCode
    ? summary.zone_wise_indicators?.[filters.zoneCode]
    : null;
  const metrics = zoneIndicator || summary;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
      {summaryError && (
        <div className="col-span-full rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
          {summaryError}
        </div>
      )}

      {/* Total Parking Events */}
      <article className="p-4 border shadow-xl rounded-2xl transition-all duration-300 backdrop-blur-md bg-panel-light dark:bg-panel-dark border-border-light dark:border-border-dark">
        <div className="text-xs opacity-60 uppercase text-gray-600 dark:text-white/60">
          Total Parking Events
        </div>
        <div
          className="mt-1.5 text-3xl font-black tracking-tighter text-gray-900 dark:text-white"
          id="mEvents"
        >
          {isSummaryLoading ? "--" : formatNumber(metrics.total_parking_events)}
        </div>
        <div className="mt-1 text-xs text-green-500 dark:text-green-400 font-medium">
          {isSummaryLoading
            ? "Loading summary..."
            : `Target ${formatNumber(metrics.target_parking_events)} • Efficiency ${formatPercent(metrics.efficiency)}`}
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
          {isSummaryLoading ? "--" : formatNumber(metrics.current_occupancy_count)}
        </div>
        <div className="mt-1 text-xs opacity-60 text-gray-500 dark:text-white/40">
          {filters?.zoneCode ? `Zone ${filters.zoneCode}` : "Across selected filters"}
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
          {isSummaryLoading ? "--" : formatNumber(metrics.active_devices_count)}
        </div>
        <div className="mt-1 text-xs opacity-60 text-gray-500 dark:text-white/40">
          From dashboard summary
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
          {isSummaryLoading ? "--" : formatNumber(metrics.alerts_triggered_count)}
        </div>
        <div className="mt-1 text-xs opacity-60 text-gray-500 dark:text-white/40">
          From dashboard summary
        </div>
      </article>
    </section>
  );
};

export default CurrentStatus;
