import React, { useContext } from "react";
import { Link } from "react-router-dom";
import BrandFilter from "../../../components/specific/BrandFilter/BrandFilter";
import CarCard from "../../../components/specific/CarCard/CarCard";
import SearchForm from "../../../components/specific/SearchForm/SearchForm";
import { BookingContext } from "../../../context/BookingContext";
import { homepageTestimonials, locations, pricing } from "../../../data/mockData";
import { useVehicles } from "../../../hooks/useVehicles";
import Spinner from "../../../components/common/Spinner";

const HomePage: React.FC = () => {
  const { vehicles, loading } = useVehicles();
  const { search, setSearch } = useContext(BookingContext);
  const [activeBrand, setActiveBrand] = React.useState("all");

  const brands = Array.from(new Set(vehicles.map((v) => v.model.brand)));
  const filtered = vehicles.filter((v) => activeBrand === "all" || v.model.brand === activeBrand).slice(0, 6);

  return (
    <div>
      <section className="hero-grid">
        <div>
          <p className="chip">Tu 400K - Linh hoat 4h/8h/12h/24h</p>
          <h1>Thue xe dien tu lai theo phong cach BonbonCar</h1>
          <p>Tim xe theo dia diem, xem gia theo goi va dat lich trong vai thao tac.</p>
          <Link to="/cars" className="link-btn">Xem tat ca xe</Link>
        </div>
        <SearchForm
          locationId={search.locationId}
          startDate={search.startDate}
          endDate={search.endDate}
          locations={locations}
          onChange={setSearch}
        />
      </section>

      <section className="section">
        <h2>3 buoc dat xe de dang</h2>
        <div className="cards-3">
          <article className="panel"><h3>1. Chon xe va giu cho</h3><p>Hang tram xe san sang theo khu vuc.</p></article>
          <article className="panel"><h3>2. eKYC nhanh gon</h3><p>Xac minh CCCD + GPLX, ky hop dong online.</p></article>
          <article className="panel"><h3>3. Nhan xe chu dong</h3><p>Nhan-tra linh hoat, ho tro 24/7.</p></article>
        </div>
      </section>

      <section className="section">
        <h2>Xe co ngay</h2>
        <BrandFilter brands={brands} active={activeBrand} onChange={setActiveBrand} />
        {loading ? <Spinner /> : (
          <div className="car-grid">
            {filtered.map((item) => (
              <CarCard
                key={item.vehicle.vehicle_id}
                data={item}
                price4h={pricing.find((p) => p.vehicle_model_id === item.model.vehicle_model_id && p.rental_plan_id === 1)?.price ?? 0}
                price24h={pricing.find((p) => p.vehicle_model_id === item.model.vehicle_model_id && p.rental_plan_id === 3)?.price ?? 0}
              />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Danh gia khach hang</h2>
        <div className="cards-3">
          {homepageTestimonials.map((t) => (
            <blockquote className="panel" key={t.id}>
              <p>{`"${t.message}"`}</p>
              <footer>{`${t.name} - ${t.area}`}</footer>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
