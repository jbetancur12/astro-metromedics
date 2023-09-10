import { useStore } from '@nanostores/react';
import React, { useEffect, useState } from 'react';
import { userStore } from '../../../store/userStore';

const apiUrl = import.meta.env.PUBLIC_API_URL;

const RequireAuth: React.FC = ({ children }) => {
  const $userStore = useStore(userStore);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem('accessToken');
    if (token) {
      fetch(`${apiUrl}/auth/validateToken`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Token no válido');
          }
        })
        .then(userData => {
          userStore.set(userData.user);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error al obtener los datos del usuario:', error);
          setLoading(false);
          window.location.href = "/login"

        });
    } else {
      setLoading(false);
      window.location.href = "/login"
    }
  }, []);

  if (loading) {
    // Mostrar un indicador de carga o mensaje de espera
    return <div>Cargando...</div>;
  }

  if (Object.keys($userStore).length === 0) {
    window.location.href = "/login"
  }

  return children;
};

export default RequireAuth;
