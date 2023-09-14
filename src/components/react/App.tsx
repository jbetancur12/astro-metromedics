import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RequireAuth from "./Authentication/RequireAuth";
import Layout from "./Common/Layout";
import Clientes from "./pages/Clientes";
import Customer from "./pages/Customer";
import Customers from "./pages/Customers";
import Equipos from "./pages/Equipos";
import Files from "./pages/Files";
import TiposDeCertificados from "./pages/TiposdeCertificado";

const apiUrl = import.meta.env.PUBLIC_API_URL;

function App() {

  const protectedLayout = (
    <RequireAuth>
      <Layout />
    </RequireAuth>
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard-back" element={protectedLayout}>
            <Route path="users" element={<Clientes />} />
            <Route path="customers" >
              <Route index element={<Customers/>}/>
              <Route path=":id" element={<Customer/>}/>
            </Route>
            <Route path="calibraciones">
              <Route path="equipos" element={<Equipos />} />
              <Route path="tipos-de-certificado" element={<TiposDeCertificados />} />
              <Route path="certificados" element={<Files />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
