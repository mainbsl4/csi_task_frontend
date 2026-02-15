import React, { useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

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

const TabSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const rows = [
    {
      id: 1,
      deviceCode: "PARK-B1-S005",
      zone: "B1",
      slot: "S005",
      lastSeen: "10:45:12",
      status: "OK",
      health: 92,
    },
    {
      id: 2,
      deviceCode: "PARK-VIP-S002",
      zone: "VIP",
      slot: "S002",
      lastSeen: "10:39:20",
      status: "OFFLINE",
      health: 45,
    },
    {
      id: 3,
      deviceCode: "PARK-B2-S011",
      zone: "B2",
      slot: "S011",
      lastSeen: "11:05:45",
      status: "OK",
      health: 88,
    },
    {
      id: 4,
      deviceCode: "PARK-A1-S020",
      zone: "A1",
      slot: "S020",
      lastSeen: "11:10:05",
      status: "OK",
      health: 95,
    },
    {
      id: 5,
      deviceCode: "PARK-B1-S009",
      zone: "B1",
      slot: "S009",
      lastSeen: "11:12:30",
      status: "WARNING",
      health: 62,
    },
  ];

  const columns = [
    { field: "deviceCode", headerName: "Device Code", flex: 1, minWidth: 150 },
    { field: "zone", headerName: "Zone", width: 100 },
    { field: "slot", headerName: "Slot", width: 100 },
    { field: "lastSeen", headerName: "Last Seen", width: 130 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const status = params.value;
        let colorClass = "bg-green-500/10 text-green-500 border-green-500/20";
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
            <div style={{ height: 500, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
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
            <div className="p-4 border border-border-light dark:border-border-dark rounded-xl bg-white/5">
              <h3 className="text-sm font-bold mb-2">Zone B1 Efficiency</h3>
              <div className="w-full bg-gray-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[85%]"></div>
              </div>
              <p className="text-[10px] mt-2 opacity-60">85% Occupancy Rate</p>
            </div>
            <div className="p-4 border border-border-light dark:border-border-dark rounded-xl bg-white/5">
              <h3 className="text-sm font-bold mb-2">Zone VIP Revenue</h3>
              <div className="w-full bg-gray-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[60%]"></div>
              </div>
              <p className="text-[10px] mt-2 opacity-60">60% vs Target</p>
            </div>
          </div>
        )}

        {/* 3. Alert Panel (As it was) */}
        {activeTab === 2 && (
          <div className="space-y-3">
            {[
              {
                type: "CRITICAL",
                msg: "Device offline > 2 min",
                device: "PARK-VIP-S002",
                time: "10:39:20",
              },
              {
                type: "WARNING",
                msg: "Battery low < 15%",
                device: "PARK-B2-S011",
                time: "11:05:45",
              },
            ].map((alert, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl border backdrop-blur-md bg-panel-light dark:bg-panel-dark border-border-light dark:border-border-dark shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 text-[10px] font-black rounded border ${
                      alert.type === "CRITICAL"
                        ? "bg-red-500/20 text-red-500 border-red-500/20"
                        : "bg-yellow-500/20 text-yellow-500 border-yellow-500/20"
                    }`}
                  >
                    {alert.type}
                  </span>
                  <div>
                    <div className="font-bold text-sm text-gray-900 dark:text-white">
                      {alert.msg}
                    </div>
                    <div className="text-[10px] opacity-40">
                      {alert.device} • {alert.time}
                    </div>
                  </div>
                </div>
                <button className="btn btn-xs btn-outline border-border-light dark:border-border-dark text-[10px]">
                  Acknowledge
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 4. Charts (As it was) */}
        {activeTab === 3 && (
          <div className="p-6 rounded-2xl border backdrop-blur-md bg-panel-light dark:bg-panel-dark border-border-light dark:border-border-dark">
            <h2 className="font-bold mb-6">Hourly Usage vs Target</h2>
            <div className="flex items-end gap-2 h-40 px-2 border-b border-dashed border-border-light dark:border-border-dark">
              {[70, 45, 90, 65, 80, 30, 55].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col justify-end gap-1 group"
                >
                  <div
                    className="w-full bg-indigo-500/40 group-hover:bg-indigo-500 rounded-t-sm transition-all"
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabSection;
