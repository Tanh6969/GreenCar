import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  locationId: number | null;
  startDate: string;
  endDate: string;
  locations: Array<{ location_id: number; name: string }>;
  onChange: (value: { locationId: number | null; startDate: string; endDate: string }) => void;
}

const SearchForm: React.FC<Props> = ({ locationId, startDate, endDate, locations, onChange }) => {
  const navigate = useNavigate();

  const handleSearch = () => navigate("/cars");

  return (
    <div className="search-card">
      <h3>🔍 Tìm xe nhanh</h3>
      <div className="search-field">
        <label>Địa điểm đón xe</label>
        <select
          value={locationId ?? ""}
          onChange={(e) => onChange({ locationId: Number(e.target.value) || null, startDate, endDate })}
        >
          <option value="">-- Chọn địa điểm --</option>
          {locations.map((l) => (
            <option key={l.location_id} value={l.location_id}>{l.name}</option>
          ))}
        </select>
      </div>
      <div className="search-field">
        <label>Ngày nhận xe</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChange({ locationId, startDate: e.target.value, endDate })}
        />
      </div>
      <div className="search-field">
        <label>Ngày trả xe</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onChange({ locationId, startDate, endDate: e.target.value })}
        />
      </div>
      <button className="btn btn-primary" style={{ width: "100%", marginTop: 4 }} onClick={handleSearch}>
        ⚡ Tìm xe ngay
      </button>
    </div>
  );
};

export default SearchForm;
