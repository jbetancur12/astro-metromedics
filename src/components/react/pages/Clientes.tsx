import axios from 'axios';
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import UserCreationModal from "../Common/UserCreationModal";

const apiUrl = import.meta.env.PUBLIC_API_URL;

const Users: React.FC = () => {
  // Estado para controlar la apertura del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const createUser = async (userData: { nombre: string; email: string, identificacion: string; contraseña: string  }) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/register`, userData)

      console.log("🚀 ~ file: Clientes.tsx:14 ~ createUser ~ response:", response)
      if (response.status === 201) {
        // Aquí puedes manejar el caso de éxito
        toast.success("Usuario Creado Exitosamente !", {
          duration: 4000,
          position: 'top-center',
        })
        setIsModalOpen(false); // Cierra el modal
      } else {
        // Aquí puedes manejar errores si el servidor devuelve un estado no exitoso
        console.error("Error al crear usuario");
      }
    } catch (error) {
      // Aquí puedes manejar errores de red u otros errores
      console.error("Error de red:", error);
    }
  };

  return (
    <>
    <div className='p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700'>
      <Toaster />
      {/* Botón para abrir el modal */}
      <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Crear Usuario</button>

      {/* Resto del contenido de Users */}

      {/* Modal de creación de usuario */}
      <UserCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateUser={createUser}
      />
    </div>
    <div className='flex flex-col'>
      <div className='overflow-x-auto'>
        <div className='inline-block min-w-full align-middle'>
          <div className='overflow-hidden shadow'>
            <table className='min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600'>
              <thead className='bg-gray-100 dark:bg-gray-700'>
                <tr>
                  <th className='p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400'>Nombre</th>
                  <th className='p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400'>Identificacion</th>
                  <th className='p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400'>Email</th>
                  <th className='p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400'>Telefono</th>
                  <th className='p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400'>Ciudad</th>


                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Users;
