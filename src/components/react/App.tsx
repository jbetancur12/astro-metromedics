import { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import Layout from "./Common/Layout";
import Clientes from "./pages/Clientes";
import Equipos from "./pages/Equipos";
import TiposDeCertificados from "./pages/TiposdeCertificado";
import Files from "./pages/Files";

class App extends Component {
  render() {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <Routes>
            <Route path="/dashboard" element={<Layout />} >
              <Route path="clientes" element={<Clientes />} />
              <Route path="calibraciones" >
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
}

export default App;
