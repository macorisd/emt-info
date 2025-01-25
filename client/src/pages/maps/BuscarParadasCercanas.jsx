import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useAPI } from "../../context/APIContext";
import "leaflet/dist/leaflet.css";

const BuscarParadasCercanas = () => {
  const [direccion, setDireccion] = useState("");
  const [paradas, setParadas] = useState([]);
  const { paradasAPI } = useAPI();

  const handleSearch = async () => {
    if (!direccion) return;

    try {
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${direccion}`
      );
      const geocodeData = await geocodeResponse.json();

      if (geocodeData && geocodeData.length > 0) {
        const { lat, lon } = geocodeData[0];
        const response = await paradasAPI.getNearby(lat, lon);
        if (response.status >= 200 && response.status < 300) {
          setParadas(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching nearby paradas:", error);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Buscar Paradas Cercanas</h1>

      <div className="row mb-4">
        <div className="col-md-10">
          <input
            type="text"
            className="form-control"
            placeholder="Dirección postal"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Buscar
          </button>
        </div>
      </div>

      <MapContainer center={[36.7213, -4.4214]} zoom={13} style={{ height: "400px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {paradas.map((parada) => (
          <Marker key={parada.codParada} position={[parada.lat, parada.lon]}>
            <Popup>
              <strong>{parada.nombreParada}</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BuscarParadasCercanas;
