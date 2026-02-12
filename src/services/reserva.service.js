import { EDPOINTS } from '../config/api';

export const getReservasPendientes = async (token) => {
  const response = await fetch(
    `${EDPOINTS.ESPACIO}/reservar/pendientes`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Error al obtener reservas pendientes');
  }

  return response.json();
};

export const actualizarEstadoReserva = async (id, estado, token) => {
  const response = await fetch(
    `${EDPOINTS.ESPACIO}/reservar/${id}/estado`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || 'Error al actualizar estado');
  }

  return data;
};
