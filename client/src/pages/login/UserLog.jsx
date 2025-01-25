import React from "react";
import { useAuth } from "../../context/AuthContext";

const UserLog = () => {
  const { getUser } = useAuth();
  const user = getUser();

  if (!user) {
    return <div className="text-center py-5">No hay información del usuario.</div>;
  }

  const truncateToken = (token, length = 20) => {
    if (token.length > length) {
      return token.substring(0, length) + "...";
    }
    return token;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Token copiado al portapapeles");
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Información del Usuario</h1>
      <ul className="list-group">
        <li className="list-group-item">
          <strong>UID:</strong> {user.uid}
        </li>
        <li className="list-group-item">
          <strong>Email:</strong> {user.email}
        </li>
        <li className="list-group-item">
          <strong>Método de Autenticación:</strong> {user.authMethod}
        </li>
        <li className="list-group-item">
          <strong>ID:</strong> {user.id}
        </li>
        <li className="list-group-item">
          <strong>Nombre:</strong> {user.name}
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>Token OAuth:</strong> {truncateToken(user.oauthToken)}
          </div>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => copyToClipboard(user.oauthToken)}
          >
            Copiar
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserLog;
