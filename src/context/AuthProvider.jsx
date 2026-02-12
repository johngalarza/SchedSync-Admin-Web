import { useState } from 'react';
import { EDPOINTS } from '../config/api';
import { decodeJWT } from '../utils/jwt';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    const decoded = decodeJWT(token);

    if (decoded && decoded.rol === 3) {
      return { ...decoded, token };
    }

    localStorage.removeItem('authToken');
    return null;
  });

  const login = async (email, password) => {
    const response = await fetch(`${EDPOINTS.AUTH}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }

    const decoded = decodeJWT(data.token);

    if (decoded.rol !== 3) {
      throw new Error('Acceso denegado: Solo administradores');
    }

    localStorage.setItem('authToken', data.token);
    setUser({ ...decoded, token: data.token });

    return data;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
