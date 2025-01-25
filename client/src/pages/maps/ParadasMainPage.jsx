import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useAPI } from "../../context/APIContext";
import "leaflet/dist/leaflet.css";

const ParadasMainPage = () => {
  const [linea, setLinea] = useState("");
  const [sentido, setSentido] = useState("");
  const [paradas, setParadas] = useState([]);
  const { paradasAPI } = useAPI();

  const handleSearch = async () => {
    if (!linea || !sentido) return;

    try {
      const response = await paradasAPI.getAll(`?codLinea=${linea}&sentido=${sentido}`);
      if (response.status >= 200 && response.status < 300) {
        setParadas(response.data);
      }
    } catch (error) {
      console.error("Error fetching paradas:", error);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Paradas por Línea y Sentido</h1>

      <div className="row mb-4">
        <div className="col-md-5">
          <input
            type="number"
            className="form-control"
            placeholder="Número de línea"
            value={linea}
            onChange={(e) => setLinea(e.target.value)}
          />
        </div>
        <div className="col-md-5">
          <select
            className="form-control"
            value={sentido}
            onChange={(e) => setSentido(e.target.value)}
          >
            <option value="">Selecciona sentido</option>
            <option value="1">Ida</option>
            <option value="2">Vuelta</option>
          </select>
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

export default ParadasMainPage;
