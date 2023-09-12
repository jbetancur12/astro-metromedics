import axios from 'axios'; // Import Axios
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup'; // Importa Yup para la validación

const apiUrl = import.meta.env.PUBLIC_API_URL;

const Login: React.FC = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [error, setError] = useState<string | null>(null); // Agrega estado para manejar errores

  // Define el esquema de validación del formulario con Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Ingresa un correo electrónico válido').required('El correo electrónico es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria'),
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      email: formData.email,
      contraseña: formData.password
    }


    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const response = await axios.post(`${apiUrl}/auth/login`, data);

      if (response.status === 200) {

        const { token } = response.data
        // Handle successful login
        toast.success("Bienvenido", {
          duration: 4000,
          position: 'top-center',
        })

        setTimeout(() => {
          window.location.href ="/dashboard"
        }, 3000);


        localStorage.setItem('accessToken', token)

        setError(null);
      } else {
        // Handle login error
        if (response.status === 401) {
          setError('Credenciales incorrectas. Por favor, verifica tus credenciales.');
        } else {
          setError('Error de inicio de sesión. Por favor, inténtalo de nuevo más tarde.');
        }
      }
    } catch (error) {

      // Handle network error or other exceptions
      if (error instanceof Yup.ValidationError) {
        const errorMessage = error.errors[0]; // Mostrar el primer error de validación
        setError(errorMessage);
      } else {
        // Manejar otros errores, como errores de red
        console.error('An error occurred:', error);
      }
      // Handle login error based on status code
      if (error.response && error.response.status === 401) {
        setError('Credenciales incorrectas. Por favor, verifica tus credenciales.');
      } else if(error.response && error.response.status === 400 && error.response.data.message === "You are not verified"){
        setError('La cuenta aun no ha sido activada');
      }else {
        setError('Error de inicio de sesión. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  };


  return (
    <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
      <Toaster />
      <a href="/" className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white">
        <img src="/images/logo2.png" className="mr-4 h-11" alt="Metromedics Logo Logo" />
        {/* <span>Metromedics S.A.S</span> */}
      </a>

      <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Ingresa a la plataforma        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="name@company.com"
              required
              value={formData.email}
              onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input id="remember" aria-describedby="remember" name="remember" type="checkbox" className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" required checked={formData.remember}
                onChange={handleInputChange} />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="remember" className="font-medium text-gray-900 dark:text-white">Recuerdame</label>
            </div>
            <a href="#" className="ml-auto text-sm text-primary-700 hover:underline dark:text-primary-500">Olvido su contraseña?</a>
          </div>
          <button type="submit" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Ingresar a tu cuenta</button>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p> // Mostrar el mensaje de error si existe
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;


