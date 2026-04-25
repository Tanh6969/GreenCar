import React from "react";

interface Props {
  brands: string[];
  active: string;
  onChange: (brand: string) => void;
}

const BrandFilter: React.FC<Props> = ({ brands, active, onChange }) => {
  return (
    <div className="brand-filter">
      <button className={active === "all" ? "active" : ""} onClick={() => onChange("all")}>Tat ca</button>
      {brands.map((brand) => (
        <button key={brand} className={active === brand ? "active" : ""} onClick={() => onChange(brand)}>
          {brand}
        </button>
      ))}
    </div>
  );
};

export default BrandFilter;
