import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Login } from "./pages/Login";
export default function App() {
  return (
    <React.Fragment>
      <Header/>
      <Router>
          <Routes>
            <Route path="/" element={<Login />}/>
          </Routes>
      </Router>
      <Footer/>
    </React.Fragment>
  );
}
