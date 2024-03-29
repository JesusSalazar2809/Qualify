import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Group } from "./pages/Group";
import { Partial } from "./pages/Partial";
export default function App() {
  return (
    <React.Fragment>
      <Header/>
      <Router>
          <Routes>
            <Route path="/" element={<Login />}/>
            <Route path="/home" element={<Home />}/>
            <Route path="/group/:id" element={<Group />}/>
            <Route path="/partial/:id" element={<Partial />}/>
          </Routes>
      </Router>
      <Footer/>
    </React.Fragment>
  );
}
