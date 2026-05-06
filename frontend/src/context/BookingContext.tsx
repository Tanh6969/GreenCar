import React, { createContext, useMemo, useState } from "react";

interface BookingSearch {
  locationId: number | null;
  startDate: string;
  endDate: string;
}

export interface PendingBooking {
  vehicleId: number;
  vehicleInfo: {
    name: string;
    brand: string;
    imageUrl: string;
    locationName: string;
    locationCity: string;
    licensePlate: string;
    batteryLevel: number;
  };
  planId: number;
  planName: string;
  planDurationHours: number;
  startTime: string;   // ISO datetime
  endTime: string;     // ISO datetime
  totalPrice: number;
  depositAmount: number;
  contactInfo: {
    name: string;
    phone: string;
    licenseNo: string;
    email: string;
  };
}

interface BookingContextValue {
  search: BookingSearch;
  setSearch: (next: BookingSearch) => void;
  pendingBooking: PendingBooking | null;
  setPendingBooking: (b: PendingBooking | null) => void;
}

export const BookingContext = createContext<BookingContextValue>({
  search: { locationId: null, startDate: "", endDate: "" },
  setSearch: () => undefined,
  pendingBooking: null,
  setPendingBooking: () => undefined,
});

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [search, setSearch] = useState<BookingSearch>({ locationId: null, startDate: "", endDate: "" });
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);

  const value = useMemo(
    () => ({ search, setSearch, pendingBooking, setPendingBooking }),
    [search, pendingBooking],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
