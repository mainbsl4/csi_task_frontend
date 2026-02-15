import React, { useEffect, useState } from "react";
import { getFacilities } from "../../../../api/facilities";
import { getZones } from "../../../../api/zones";

const FiltarsInpus = () => {
  const [selectedFacilityId, setSelectedFacilityId] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState("");

  const [facilities, setFacilities] = useState([]);
  const [isFacilitiesLoading, setIsFacilitiesLoading] = useState(true);
  const [facilityError, setFacilityError] = useState("");

  const [zones, setZones] = useState([]);
  const [isZonesLoading, setIsZonesLoading] = useState(true);
  const [zoneError, setZoneError] = useState("");

  useEffect(() => {
    const abortController = new AbortController();

    const loadFacilities = async () => {
      try {
        setIsFacilitiesLoading(true);
        setFacilityError("");

        const data = await getFacilities({ signal: abortController.signal });
        setFacilities(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          setFacilityError("Unable to load facilities");
        }
      } finally {
        setIsFacilitiesLoading(false);
      }
    };

    loadFacilities();

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    const loadZones = async () => {
      try {
        setIsZonesLoading(true);
        setZoneError("");

        const data = await getZones({
          parkingFacility: selectedFacilityId || undefined,
          signal: abortController.signal,
        });

        setZones(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          setZoneError("Unable to load zones");
        }
      } finally {
        setIsZonesLoading(false);
      }
    };

    loadZones();

    return () => abortController.abort();
  }, [selectedFacilityId]);

  return (
    <div className="flex flex-wrap items-end gap-3 transition-colors duration-300">
      {/* Facility Select */}
      <div className="flex flex-col flex-1 min-w-[170px] gap-1.5">
        <label className="text-xs opacity-60 text-gray-600 dark:text-white/60">
          Facility
        </label>
        <select
          id="facility"
          value={selectedFacilityId}
          onChange={(event) => {
            setSelectedFacilityId(event.target.value);
            setSelectedZoneId("");
          }}
          disabled={isFacilitiesLoading}
          className="p-2.5 text-sm border outline-none rounded-xl transition-all
                     bg-panel-light dark:bg-panel-dark 
                     border-border-light dark:border-border-dark 
                     text-gray-900 dark:text-white/90"
        >
          <option value="">All Facilities</option>

          {isFacilitiesLoading && <option value="">Loading facilities...</option>}

          {!isFacilitiesLoading && facilityError && (
            <option value="" disabled>
              {facilityError}
            </option>
          )}

          {!isFacilitiesLoading &&
            !facilityError &&
            facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name}
              </option>
            ))}
        </select>
      </div>

      {/* Zone Select */}
      <div className="flex flex-col flex-1 min-w-[170px] gap-1.5">
        <label className="text-xs opacity-60 text-gray-600 dark:text-white/60">
          Zone
        </label>
        <select
          id="zone"
          value={selectedZoneId}
          onChange={(event) => setSelectedZoneId(event.target.value)}
          disabled={isZonesLoading}
          className="p-2.5 text-sm border outline-none rounded-xl transition-all
                     bg-panel-light dark:bg-panel-dark 
                     border-border-light dark:border-border-dark 
                     text-gray-900 dark:text-white/90"
        >
          <option value="">All Zones</option>

          {isZonesLoading && <option value="">Loading zones...</option>}

          {!isZonesLoading && zoneError && (
            <option value="" disabled>
              {zoneError}
            </option>
          )}

          {!isZonesLoading &&
            !zoneError &&
            zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name} ({zone.code})
              </option>
            ))}
        </select>
      </div>

      {/* Date Input */}
      <div className="flex flex-col min-w-[300px] gap-1.5">
        <label className="text-xs opacity-60 text-gray-600 dark:text-white/60">
          Date From
        </label>
        <input
          id="dateFrom"
          type="date"
          className="p-2.5 text-sm border outline-none rounded-xl transition-all
                     bg-panel-light dark:bg-panel-dark 
                     border-border-light dark:border-border-dark 
                     text-gray-900 dark:text-white/90 
                     [color-scheme:light] dark:[color-scheme:dark]"
        />
      </div>
    </div>
  );
};

export default FiltarsInpus;
