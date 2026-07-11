import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icon issue
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3202/3202926.png",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

interface DeliveryMapProps {
  carLat: number;
  carLng: number;
  carAddress: string;
  onDistanceChange: (distanceKm: number, address: string) => void;
  defaultNoteAddress: string;
}

// Calculate haversine distance
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ carLat, carLng, carAddress, onDistanceChange, defaultNoteAddress }) => {
  const [deliveryPos, setDeliveryPos] = useState<[number, number]>([carLat + 0.02, carLng + 0.02]);
  const [address, setAddress] = useState(defaultNoteAddress || "Điểm giao xe tùy chọn");
  const [searching, setSearching] = useState(false);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState(0);

  // Auto search on mount if default address is provided
  useEffect(() => {
    if (defaultNoteAddress) {
      handleSearch(defaultNoteAddress);
    }
  }, []); // eslint-disable-line

  // Fetch real route from OSRM when positions change
  useEffect(() => {
    let isActive = true;

    const fetchRoute = async () => {
      try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${carLng},${carLat};${deliveryPos[1]},${deliveryPos[0]}?overview=full&geometries=geojson`);
        const data = await res.json();
        
        if (!isActive) return;

        if (data.code === "Ok" && data.routes.length > 0) {
          const route = data.routes[0];
          // OSRM returns distance in meters, convert to km
          setDistance(route.distance / 1000);
          
          // GeoJSON coordinates are [lon, lat], Leaflet needs [lat, lon]
          const coords = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);
          
          // Ensure the route visibly connects to the exact marker coordinates
          setRoutePath([[carLat, carLng], ...coords, deliveryPos]);
        } else {
          // Fallback to straight line if routing fails
          setDistance(getDistanceKm(carLat, carLng, deliveryPos[0], deliveryPos[1]));
          setRoutePath([[carLat, carLng], deliveryPos]);
        }
      } catch (e) {
        if (!isActive) return;
        console.error("OSRM error:", e);
        // Fallback
        setDistance(getDistanceKm(carLat, carLng, deliveryPos[0], deliveryPos[1]));
        setRoutePath([[carLat, carLng], deliveryPos]);
      }
    };
    
    fetchRoute();

    return () => {
      isActive = false;
    };
  }, [carLat, carLng, deliveryPos[0], deliveryPos[1]]); // eslint-disable-line

  useEffect(() => {
    // Notify parent about distance and address
    onDistanceChange(Math.round(distance * 10) / 10, address);
  }, [distance, address]); // eslint-disable-line

  const handleSearch = async (searchQuery: string = address) => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=vn`);
      const data = await res.json();
      if (data && data.length > 0) {
        setDeliveryPos([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setAddress(searchQuery); // Update input field if it was an auto-search
      }
    } catch (e) {
      console.error(e);
    }
    setSearching(false);
  };



  const DraggableMarker = () => {
    const map = useMapEvents({
      click(e) {
        setDeliveryPos([e.latlng.lat, e.latlng.lng]);
        setAddress(`Vị trí đã ghim (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`);
      }
    });

    return (
      <Marker
        draggable={true}
        eventHandlers={{
          dragend(e) {
            const marker = e.target;
            const position = marker.getLatLng();
            setDeliveryPos([position.lat, position.lng]);
            setAddress(`Vị trí đã ghim (${position.lat.toFixed(4)}, ${position.lng.toFixed(4)})`);
          },
        }}
        position={deliveryPos}
        icon={userIcon}
      >
        <Popup>Điểm giao xe của bạn (Kéo để thả)</Popup>
      </Marker>
    );
  };

  const RecenterMap = () => {
    const map = useMap();
    useEffect(() => {
      const bounds = L.latLngBounds([carLat, carLng], deliveryPos);
      map.fitBounds(bounds, { padding: [50, 50] });
    }, [deliveryPos, map]);
    return null;
  };

  return (
    <div className="mt-4 flex flex-col gap-3">
      <label className="block text-xs font-bold text-[#6E7A72] uppercase tracking-wide">
        Bản đồ vị trí giao xe
      </label>
      
      <div className="flex gap-2">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Nhập địa chỉ giao xe (VD: Đại học Bách Khoa Hà Nội)..."
          className="flex-1 border border-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:border-[#006C4C]"
        />
        <button
          type="button"
          onClick={() => handleSearch()}
          disabled={searching}
          className="bg-[#006C4C] text-white px-4 rounded-xl text-sm font-bold hover:bg-[#004832] transition-colors"
        >
          {searching ? "..." : "Tìm"}
        </button>
      </div>

      <div className="h-[350px] w-full rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm relative z-0">
        <MapContainer center={[carLat, carLng]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={[carLat, carLng]} icon={carIcon}>
            <Popup>
              <b>Bãi xe:</b> {carAddress}
            </Popup>
          </Marker>
          <DraggableMarker />
          <Polyline positions={routePath.length > 0 ? routePath : [[carLat, carLng], deliveryPos]} color="#006C4C" weight={4} opacity={0.8} />
          <RecenterMap />
        </MapContainer>
      </div>

      <div className="flex justify-between items-center bg-[#F0FDF4] p-3 rounded-xl border border-[#bbf7d0]">
        <div className="text-[#3E4943] text-sm">
          Khoảng cách giao xe: <span className="font-bold text-[#006C4C]">{distance.toFixed(1)} km</span>
        </div>
        <div className="text-xs text-[#6E7A72]">
          Bạn có thể kéo thả ghim đỏ để chọn vị trí chính xác.
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;
