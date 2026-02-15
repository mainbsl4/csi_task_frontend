import React, { useEffect, useRef, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { getDevicesStatus } from "../../../../api/devices";
import { getDashboardSummary } from "../../../../api/dashboard";
import { acknowledgeAlert, getAlerts } from "../../../../api/alerts";
import { getHourlyUsage } from "../../../../api/metrics";
import { Chart } from "chart.js/auto";

const MyDataTableToolbar = () => {
  return (
    <GridToolbarContainer className="flex flex-wrap items-center justify-between p-3 gap-4 border-b border-border-light dark:border-border-dark bg-white/5">
      <div className="flex flex-wrap gap-2">
        <GridToolbarColumnsButton className="text-[11px] font-bold text-indigo-500 hover:bg-indigo-500/10" />
        <GridToolbarFilterButton className="text-[11px] font-bold text-indigo-500 hover:bg-indigo-500/10" />
        <GridToolbarExport className="text-[11px] font-bold text-indigo-500 hover:bg-indigo-500/10" />
      </div>

      <div className="flex-1 max-w-sm">
        <GridToolbarQuickFilter
          variant="outlined"
          size="small"
          placeholder="Search devices..."
          className="w-full"
          sx={{
            "& .MuiInputBase-root": {
              fontSize: "12px",
              borderRadius: "8px",
              height: "35px",
              color: "inherit",
              "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
            },
          }}
        />
      </div>
    </GridToolbarContainer>
  );
};

const formatLastSeen = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleString();
};

const formatTimestamp = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleString();
};

const formatHourLabel = (value) => {
  if (!value) {
    return "--";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const TabSection = ({ filters, refreshTick }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [rows, setRows] = useState([]);
  const [isDevicesLoading, setIsDevicesLoading] = useState(true);
  const [devicesError, setDevicesError] = useState("");
  const [zoneSummary, setZoneSummary] = useState({ zone_wise_indicators: {} });
  const [isZoneSummaryLoading, setIsZoneSummaryLoading] = useState(false);
  const [zoneSummaryError, setZoneSummaryError] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [isAlertsLoading, setIsAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState("");
  const [selectedAlertStatus, setSelectedAlertStatus] = useState("ACTIVE");
  const [selectedAlertSeverity, setSelectedAlertSeverity] = useState("ALL");
  const [acknowledgingAlertIds, setAcknowledgingAlertIds] = useState({});
  const [hourlyUsage, setHourlyUsage] = useState([]);
  const [hourlyTarget, setHourlyTarget] = useState(null);
  const [isHourlyUsageLoading, setIsHourlyUsageLoading] = useState(false);
  const [hourlyUsageError, setHourlyUsageError] = useState("");
  const lineChartCanvasRef = useRef(null);
  const lineChartInstanceRef = useRef(null);

  useEffect(() => {
    if (activeTab !== 0) {
      return undefined;
    }

    const abortController = new AbortController();

    const loadDevices = async () => {
      try {
        setIsDevicesLoading(true);
        setDevicesError("");

        const data = await getDevicesStatus({
          facility: filters?.facility || undefined,
          zoneCode: filters?.zoneCode || undefined,
          signal: abortController.signal,
        });

        const devices = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];

        const mappedRows = devices.map((device, index) => ({
          id: device.device_code || `${device.zone_code || "zone"}-${index}`,
          deviceCode: device.device_code || "N/A",
          zone: device.zone_code || "N/A",
          facility: device.facility || "N/A",
          isActive: device.is_active ? "Yes" : "No",
          lastSeen: formatLastSeen(device.last_seen),
          status: device.status || "UNKNOWN",
          health: Number(device.health_score ?? 0),
          activeAlerts: Number(device.active_alerts ?? 0),
        }));

        setRows(mappedRows);
      } catch (error) {
        if (error.name !== "AbortError") {
          setDevicesError("Unable to load live monitoring devices");
        }
      } finally {
        setIsDevicesLoading(false);
      }
    };

    loadDevices();

    return () => abortController.abort();
  }, [activeTab, filters?.facility, filters?.zoneCode, refreshTick]);

  useEffect(() => {
    if (activeTab !== 1) {
      return undefined;
    }

    const abortController = new AbortController();

    const loadZoneSummary = async () => {
      try {
        setIsZoneSummaryLoading(true);
        setZoneSummaryError("");

        const data = await getDashboardSummary({
          date: filters?.date || undefined,
          facility: filters?.facility || undefined,
          zoneCode: filters?.zoneCode || undefined,
          signal: abortController.signal,
        });

        setZoneSummary({
          zone_wise_indicators: {},
          ...(data || {}),
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          setZoneSummaryError("Unable to load zone performance");
        }
      } finally {
        setIsZoneSummaryLoading(false);
      }
    };

    loadZoneSummary();

    return () => abortController.abort();
  }, [activeTab, filters?.date, filters?.facility, filters?.zoneCode, refreshTick]);

  useEffect(() => {
    if (activeTab !== 2) {
      return undefined;
    }

    const abortController = new AbortController();

    const loadAlerts = async () => {
      try {
        setIsAlertsLoading(true);
        setAlertsError("");

        const data = await getAlerts({
          status: selectedAlertStatus === "ALL" ? undefined : selectedAlertStatus,
          severity:
            selectedAlertSeverity === "ALL" ? undefined : selectedAlertSeverity,
          signal: abortController.signal,
        });

        const allAlerts = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : data && typeof data === "object"
              ? [data]
              : [];

        setAlerts(allAlerts);
      } catch (error) {
        if (error.name !== "AbortError") {
          setAlertsError("Unable to load alerts");
        }
      } finally {
        setIsAlertsLoading(false);
      }
    };

    loadAlerts();

    return () => abortController.abort();
  }, [activeTab, refreshTick, selectedAlertStatus, selectedAlertSeverity]);

  useEffect(() => {
    if (activeTab !== 3) {
      return undefined;
    }

    const abortController = new AbortController();

    const loadHourlyChart = async () => {
      try {
        setIsHourlyUsageLoading(true);
        setHourlyUsageError("");

        const [hourlyData, summaryData] = await Promise.all([
          getHourlyUsage({
            date: filters?.date || undefined,
            facilityId: filters?.facility || undefined,
            zoneCode: filters?.zoneCode || undefined,
            signal: abortController.signal,
          }),
          getDashboardSummary({
            date: filters?.date || undefined,
            facility: filters?.facility || undefined,
            zoneCode: filters?.zoneCode || undefined,
            signal: abortController.signal,
          }),
        ]);

        const hourlyRows = Array.isArray(hourlyData?.hourly)
          ? hourlyData.hourly
          : Array.isArray(hourlyData)
            ? hourlyData
            : [];

        const mappedRows = hourlyRows.map((item, index) => ({
          id: `${item.hour || "hour"}-${index}`,
          hour: item.hour,
          hourLabel: formatHourLabel(item.hour),
          totalEvents: Number(item.total_events ?? 0),
          occupiedEvents: Number(item.occupied_events ?? 0),
        }));

        setHourlyUsage(mappedRows);

        const zoneTarget = filters?.zoneCode
          ? summaryData?.zone_wise_indicators?.[filters.zoneCode]
              ?.target_parking_events
          : null;

        const dailyTarget = zoneTarget ?? summaryData?.target_parking_events;
        const parsedDailyTarget = Number(dailyTarget);

        if (
          dailyTarget !== null &&
          dailyTarget !== undefined &&
          !Number.isNaN(parsedDailyTarget)
        ) {
          setHourlyTarget(parsedDailyTarget / 24);
        } else {
          setHourlyTarget(null);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setHourlyUsageError("Unable to load hourly usage");
        }
      } finally {
        setIsHourlyUsageLoading(false);
      }
    };

    loadHourlyChart();

    return () => abortController.abort();
  }, [activeTab, filters?.date, filters?.facility, filters?.zoneCode, refreshTick]);

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      setAcknowledgingAlertIds((prevState) => ({
        ...prevState,
        [alertId]: true,
      }));

      await acknowledgeAlert({ alertId });
      if (selectedAlertStatus === "ACTIVE") {
        setAlerts((prevAlerts) =>
          prevAlerts.filter((alert) => alert.id !== alertId),
        );
      } else {
        setAlerts((prevAlerts) =>
          prevAlerts.map((alert) =>
            alert.id === alertId
              ? { ...alert, status: "ACKNOWLEDGED" }
              : alert,
          ),
        );
      }
    } catch {
      setAlertsError("Failed to acknowledge alert");
    } finally {
      setAcknowledgingAlertIds((prevState) => ({
        ...prevState,
        [alertId]: false,
      }));
    }
  };

  const zoneIndicators = Object.entries(zoneSummary?.zone_wise_indicators || {});
  const chartMaxValue = Math.max(
    1,
    ...hourlyUsage.map((item) => item.totalEvents),
    hourlyTarget || 0,
  );
  const hasHourlyTarget = hourlyTarget !== null;
  const hourlyTargetPercent = hasHourlyTarget
    ? Math.max(0, Math.min(100, (hourlyTarget / chartMaxValue) * 100))
    : 0;

  useEffect(() => {
    if (activeTab !== 3) {
      return undefined;
    }

    if (lineChartInstanceRef.current) {
      lineChartInstanceRef.current.destroy();
      lineChartInstanceRef.current = null;
    }

    if (!lineChartCanvasRef.current || hourlyUsage.length === 0) {
      return undefined;
    }

    const labels = hourlyUsage.map((item) => item.hourLabel);
    const actualSeries = hourlyUsage.map((item) => item.totalEvents);
    const targetSeries = hasHourlyTarget
      ? labels.map(() => Number(hourlyTarget.toFixed(2)))
      : [];

    lineChartInstanceRef.current = new Chart(lineChartCanvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Actual Events",
            data: actualSeries,
            borderColor: "rgba(99, 102, 241, 1)",
            backgroundColor: "rgba(99, 102, 241, 0.18)",
            borderWidth: 2,
            pointRadius: 3,
            tension: 0.3,
            fill: true,
          },
          ...(hasHourlyTarget
            ? [
                {
                  label: "Hourly Target",
                  data: targetSeries,
                  borderColor: "rgba(248, 113, 113, 1)",
                  borderWidth: 2,
                  borderDash: [6, 4],
                  pointRadius: 0,
                  tension: 0,
                  fill: false,
                },
              ]
            : []),
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "rgba(255,255,255,0.85)" },
          },
        },
        scales: {
          x: {
            ticks: { color: "rgba(255,255,255,0.65)" },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
          y: {
            beginAtZero: true,
            ticks: { color: "rgba(255,255,255,0.65)" },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
        },
      },
    });

    return () => {
      if (lineChartInstanceRef.current) {
        lineChartInstanceRef.current.destroy();
        lineChartInstanceRef.current = null;
      }
    };
  }, [activeTab, hourlyUsage, hasHourlyTarget, hourlyTarget]);

  const columns = [
    { field: "deviceCode", headerName: "Device Code", flex: 1, minWidth: 150 },
    { field: "zone", headerName: "Zone", width: 100 },
    { field: "facility", headerName: "Facility", flex: 1, minWidth: 180 },
    { field: "isActive", headerName: "Active", width: 90 },
    { field: "lastSeen", headerName: "Last Seen", minWidth: 180, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const status = params.value;
        let colorClass =
          "bg-gray-500/10 text-gray-500 border-gray-500/20";

        if (status === "OK" || status === "ONLINE") {
          colorClass = "bg-green-500/10 text-green-500 border-green-500/20";
        }

        if (status === "OFFLINE")
          colorClass = "bg-red-500/10 text-red-500 border-red-500/20";
        if (status === "WARNING")
          colorClass = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase ${colorClass}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      field: "health",
      headerName: "Health",
      width: 100,
      renderCell: (params) => (
        <span className="font-bold text-indigo-500">{params.value}%</span>
      ),
    },
    { field: "activeAlerts", headerName: "Alerts", width: 90 },
  ];

  const tabs = [
    { id: 0, label: "Live Monitoring" },
    { id: 1, label: "Zone Performance" },
    { id: 2, label: "Alert Panel" },
    { id: 3, label: "Charts" },
  ];

  return (
    <div className="space-y-6 mt-6">
      {/* Tabs Buttons */}
      <div role="tablist" className="flex flex-wrap gap-2.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 text-xs font-bold border transition-all duration-300 rounded-full
              ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30 scale-105"
                  : "bg-panel-light dark:bg-panel-dark text-gray-500 dark:text-white/60 border-border-light dark:border-border-dark hover:border-indigo-500/30"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents Area */}
      <div className="min-h-[500px]">
        {activeTab === 0 && (
          <div className="rounded-2xl border shadow-2xl backdrop-blur-md bg-panel-light dark:bg-panel-dark border-border-light dark:border-border-dark overflow-hidden transition-all duration-500">
            {devicesError && (
              <div className="mx-4 mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                {devicesError}
              </div>
            )}

            <div style={{ height: 500, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                loading={isDevicesLoading}
                slots={{ toolbar: MyDataTableToolbar }}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5, 10, 20]}
                disableRowSelectionOnClick
                sx={{
                  border: "none",
                  color: "#ffffff",
                  backgroundColor: "transparent",
                  "& .MuiDataGrid-main": {
                    backgroundColor: "bg-panel-light dark:bg-panel-dark",
                    borderRadius: "16px",
                    border:
                      "1px solid var(--color-border-dark, rgba(255, 255, 255, 0.1))",
                    overflow: "hidden",
                  },

                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "rgba(255, 255, 255, 0.02) !important",
                    backdropFilter: "blur(16px)",
                    textTransform: "uppercase",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.05rem",
                    borderBottom:
                      "1px solid var(--color-border-dark, rgba(255, 255, 255, 0.1))",
                  },

                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "transparent !important",
                    "&:hover, &:focus, &:focus-within": {
                      backgroundColor: "transparent !important",
                      outline: "none !important",
                    },
                  },

                  "& .MuiDataGrid-cell": {
                    borderBottom:
                      "1px solid var(--color-border-dark, rgba(255, 255, 255, 0.05))",
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "0.8rem",
                    "&:focus, &:focus-within": { outline: "none !important" },
                  },

                  "& .MuiDataGrid-row": {
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(79, 70, 229, 0.1) !important",
                      boxShadow: "inset 0 0 15px rgba(79, 70, 229, 0.05)",
                    },
                  },

                  "& .MuiDataGrid-footerContainer": {
                    borderTop:
                      "1px solid var(--color-border-dark, rgba(255, 255, 255, 0.1))",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  },

                  "& .MuiTablePagination-root, & .MuiTablePagination-selectIcon, & .MuiButtonBase-root":
                    {
                      color: "#ffffff !important",
                    },
                  "& .MuiDataGrid-iconButtonContainer .MuiButtonBase-root": {
                    backgroundColor: "transparent !important",
                  },

                  "& .MuiDataGrid-iconButtonContainer .MuiButtonBase-root:hover":
                    {
                      backgroundColor: "transparent !important",
                    },

                  "& .MuiDataGrid-iconButtonContainer .MuiButtonBase-root:focus":
                    {
                      backgroundColor: "transparent !important",
                    },

                  "& .MuiDataGrid-iconButtonContainer .MuiButtonBase-root:focus-within":
                    {
                      backgroundColor: "transparent !important",
                    },
                }}
                slotProps={{
                  toolbar: {
                    printOptions: { disableToolbarButton: true },
                  },
                }}
                showToolbar
              />
            </div>
          </div>
        )}

        {/* 2. Zone Performance (As it was) */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl border backdrop-blur-md bg-panel-light dark:bg-panel-dark border-border-light dark:border-border-dark">
            {zoneSummaryError && (
              <div className="md:col-span-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                {zoneSummaryError}
              </div>
            )}

            {!zoneSummaryError && isZoneSummaryLoading && (
              <div className="md:col-span-2 text-xs opacity-60 text-gray-600 dark:text-white/60">
                Loading zone performance...
              </div>
            )}

            {!zoneSummaryError && !isZoneSummaryLoading && zoneIndicators.length === 0 && (
              <div className="md:col-span-2 text-xs opacity-60 text-gray-600 dark:text-white/60">
                No zone performance data available for current filters.
              </div>
            )}

            {!zoneSummaryError &&
              !isZoneSummaryLoading &&
              zoneIndicators.map(([zoneCode, indicator]) => {
                const eventCount = Number(indicator?.total_parking_events ?? 0);
                const occupancyCount = Number(indicator?.current_occupancy_count ?? 0);
                const activeDevices = Number(indicator?.active_devices_count ?? 0);
                const alerts = Number(indicator?.alerts_triggered_count ?? 0);
                const targetParkingEvents = indicator?.target_parking_events;
                const efficiency = indicator?.efficiency;
                const efficiencyValue = Number(efficiency ?? 0);
                const hasEfficiency = efficiency !== null && !Number.isNaN(efficiencyValue);
                const progressWidth = hasEfficiency
                  ? Math.max(0, Math.min(100, efficiencyValue))
                  : 0;

                return (
                  <div
                    key={zoneCode}
                    className="p-4 border border-border-light dark:border-border-dark rounded-xl bg-white/5"
                  >
                    <h3 className="text-sm font-bold mb-2">Zone {zoneCode} Performance</h3>
                    <div className="w-full bg-gray-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-full transition-all duration-300"
                        style={{ width: `${progressWidth}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] mt-2 opacity-60">
                      Events {eventCount} • Occupancy {occupancyCount}
                    </p>
                    <p className="text-[10px] mt-1 opacity-60">
                      Active Devices {activeDevices} • Alerts {alerts}
                    </p>
                    <p className="text-[10px] mt-1 opacity-60">
                      Target {targetParkingEvents ?? "N/A"} • Efficiency{" "}
                      {hasEfficiency ? `${efficiencyValue.toFixed(1)}%` : "N/A"}
                    </p>
                  </div>
                );
              })}
          </div>
        )}

        {/* 3. Alert Panel (As it was) */}
        {activeTab === 2 && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border-light dark:border-border-dark bg-panel-light dark:bg-panel-dark">
              <div className="text-xs text-gray-600 dark:text-white/60">
                {selectedAlertStatus === "ACTIVE" ? "Active Alerts" : "Alerts"}:{" "}
                <span className="font-bold text-gray-900 dark:text-white">
                  {alerts.length}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label
                  htmlFor="alertStatus"
                  className="text-xs opacity-60 text-gray-600 dark:text-white/60"
                >
                  Status
                </label>
                <select
                  id="alertStatus"
                  value={selectedAlertStatus}
                  onChange={(event) => setSelectedAlertStatus(event.target.value)}
                  className="p-2 text-xs border outline-none rounded-lg transition-all
                             bg-panel-light dark:bg-panel-dark 
                             border-border-light dark:border-border-dark 
                             text-gray-900 dark:text-white/90"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="ACKNOWLEDGED">Acknowledged</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="ALL">All</option>
                </select>

                <label
                  htmlFor="alertSeverity"
                  className="text-xs opacity-60 text-gray-600 dark:text-white/60"
                >
                  Severity
                </label>
                <select
                  id="alertSeverity"
                  value={selectedAlertSeverity}
                  onChange={(event) => setSelectedAlertSeverity(event.target.value)}
                  className="p-2 text-xs border outline-none rounded-lg transition-all
                             bg-panel-light dark:bg-panel-dark 
                             border-border-light dark:border-border-dark 
                             text-gray-900 dark:text-white/90"
                >
                  <option value="ALL">All</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="WARNING">Warning</option>
                  <option value="INFO">Info</option>
                </select>
              </div>
            </div>

            {alertsError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                {alertsError}
              </div>
            )}

            {!alertsError && isAlertsLoading && (
              <div className="text-xs opacity-60 text-gray-600 dark:text-white/60">
                Loading alerts...
              </div>
            )}

            {!alertsError && !isAlertsLoading && alerts.length === 0 && (
              <div className="text-xs opacity-60 text-gray-600 dark:text-white/60">
                No matching alerts found.
              </div>
            )}

            {!alertsError &&
              !isAlertsLoading &&
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 rounded-xl border backdrop-blur-md bg-panel-light dark:bg-panel-dark border-border-light dark:border-border-dark shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-2 py-1 text-[10px] font-black rounded border ${
                        alert.severity === "CRITICAL"
                          ? "bg-red-500/20 text-red-500 border-red-500/20"
                          : alert.severity === "WARNING"
                            ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/20"
                            : "bg-indigo-500/20 text-indigo-500 border-indigo-500/20"
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-gray-900 dark:text-white">
                        {alert.message}
                      </div>
                      <div className="text-[10px] opacity-40">
                        {alert.device_code} • {alert.alert_type} • {alert.status}
                      </div>
                      <div className="text-[10px] opacity-40">
                        Last Triggered: {formatTimestamp(alert.last_triggered_at)}
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-xs btn-outline border-border-light dark:border-border-dark text-[10px]"
                    disabled={
                      Boolean(acknowledgingAlertIds[alert.id]) ||
                      alert.status !== "ACTIVE"
                    }
                    onClick={() => handleAcknowledgeAlert(alert.id)}
                  >
                    {alert.status !== "ACTIVE"
                      ? alert.status
                      : acknowledgingAlertIds[alert.id]
                      ? "Acknowledging..."
                      : "Acknowledge"}
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* 4. Charts (As it was) */}
        {activeTab === 3 && (
          <div className="p-6 rounded-2xl border backdrop-blur-md bg-panel-light dark:bg-panel-dark border-border-light dark:border-border-dark">
            <h2 className="font-bold mb-6">Hourly Usage vs Target</h2>

            {hourlyUsageError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400 mb-4">
                {hourlyUsageError}
              </div>
            )}

            {!hourlyUsageError && isHourlyUsageLoading && (
              <div className="text-xs opacity-60 text-gray-600 dark:text-white/60 mb-4">
                Loading hourly usage...
              </div>
            )}

            {!hourlyUsageError && !isHourlyUsageLoading && hourlyUsage.length === 0 && (
              <div className="text-xs opacity-60 text-gray-600 dark:text-white/60 mb-4">
                No hourly usage data found.
              </div>
            )}

            {!hourlyUsageError && !isHourlyUsageLoading && hourlyUsage.length > 0 && (
              <>
                <div className="flex items-center justify-between text-[10px] opacity-70 mb-3">
                  <span>
                    Hourly Target: {hasHourlyTarget ? hourlyTarget.toFixed(2) : "N/A"}
                  </span>
                  <span>Bars = total_events</span>
                </div>

                <div className="relative h-44 px-2 border-b border-dashed border-border-light dark:border-border-dark">
                  {hasHourlyTarget && (
                    <div
                      className="absolute left-2 right-2 border-t border-red-400/80 border-dashed"
                      style={{ bottom: `${hourlyTargetPercent}%` }}
                    >
                      <span className="absolute -top-4 right-0 text-[10px] text-red-500 dark:text-red-400">
                        Target {hourlyTarget.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="h-full flex items-end gap-2">
                    {hourlyUsage.map((item) => (
                      <div
                        key={item.id}
                        className="flex-1 min-w-[28px] flex flex-col justify-end gap-1 group"
                        title={`${item.hourLabel} • Events ${item.totalEvents}`}
                      >
                        <div
                          className="w-full bg-indigo-500/40 group-hover:bg-indigo-500 rounded-t-sm transition-all"
                          style={{
                            height: `${Math.max(
                              2,
                              (item.totalEvents / chartMaxValue) * 100,
                            )}%`,
                          }}
                        ></div>
                        <div className="text-[10px] text-center opacity-60">
                          {item.hourLabel}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 h-72 rounded-xl border border-border-light dark:border-border-dark p-3 bg-white/5">
                  <h3 className="text-xs font-bold mb-3 text-gray-900 dark:text-white/90">
                    Hourly Events Trend (Chart.js)
                  </h3>
                  <canvas ref={lineChartCanvasRef}></canvas>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabSection;
