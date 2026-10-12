import React, { createContext, useContext, useState, useEffect } from 'react';
import { dashboardApi } from '../services/api';

interface FilterContextType {
  selectedFacilityId: number | undefined;
  setSelectedFacilityId: (id: number | undefined) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  facilities: Array<{ id: number; name: string; facility_type: string; location: string }>;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | undefined>(undefined);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');
  const [facilities, setFacilities] = useState<any[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    dashboardApi.getFacilities().then((data) => {
      setFacilities(data);
    }).catch(console.error);
  }, []);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <FilterContext.Provider
      value={{
        selectedFacilityId,
        setSelectedFacilityId,
        selectedPeriod,
        setSelectedPeriod,
        facilities,
        refreshTrigger,
        triggerRefresh
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
