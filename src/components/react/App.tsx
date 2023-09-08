import { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Common/Layout";
import Clientes from "./pages/Clientes";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
          <Routes>
            <Route path="/dashboard"   element={<Layout/>} >
              <Route path="clientes" element={<Clientes/>}/>
              </Route>
          </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
