import { EDPOINTS } from '../config/api';

export const getIncidencias = async (token, filtros = {}) => {
  const filtrosLimpios = Object.fromEntries(
    Object.entries(filtros).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

  const query = new URLSearchParams(filtrosLimpios).toString();

  const response = await fetch(
    query
      ? `${EDPOINTS.INCIDENCIA}?${query}`
      : EDPOINTS.INCIDENCIA,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener incidencias");
  }

  return response.json();
};

export const updateEstadoIncidencia = async (token, id, estado) => {
  const response = await fetch(
    `${EDPOINTS.INCIDENCIA}/${id}/estado`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado }),
    }
  );

  if (!response.ok) {
    throw new Error('Error al actualizar estado');
  }

  return response.json();
};
