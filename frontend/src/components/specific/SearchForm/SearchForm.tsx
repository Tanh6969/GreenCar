import React from "react";
import Button from "../../common/Button";

interface Props {
  locationId: number | null;
  startDate: string;
  endDate: string;
  locations: Array<{ location_id: number; name: string }>;
  onChange: (value: { locationId: number | null; startDate: string; endDate: string }) => void;
}

const SearchForm: React.FC<Props> = ({ locationId, startDate, endDate, locations, onChange }) => {
  return (
    <div className="search-box">
      <h3>Tim xe nhanh</h3>
      <select
        value={locationId ?? ""}
        onChange={(e) => onChange({ locationId: Number(e.target.value) || null, startDate, endDate })}
      >
        <option value="">Chon dia diem</option>
        {locations.map((l) => (
          <option key={l.location_id} value={l.location_id}>{l.name}</option>
        ))}
      </select>
      <input type="date" value={startDate} onChange={(e) => onChange({ locationId, startDate: e.target.value, endDate })} />
      <input type="date" value={endDate} onChange={(e) => onChange({ locationId, startDate, endDate: e.target.value })} />
      <Button>Tim xe</Button>
    </div>
  );
};

export default SearchForm;
