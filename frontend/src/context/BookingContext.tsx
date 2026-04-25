import React, { createContext, useMemo, useState } from "react";

interface BookingSearch {
  locationId: number | null;
  startDate: string;
  endDate: string;
}

interface BookingContextValue {
  search: BookingSearch;
  setSearch: (next: BookingSearch) => void;
}

export const BookingContext = createContext<BookingContextValue>({
  search: { locationId: null, startDate: "", endDate: "" },
  setSearch: () => undefined
});

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [search, setSearch] = useState<BookingSearch>({ locationId: null, startDate: "", endDate: "" });

  const value = useMemo(() => ({ search, setSearch }), [search]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
