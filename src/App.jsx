import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductPage from "./ProductPage";
import PaymentPage from "./PaymentPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}
