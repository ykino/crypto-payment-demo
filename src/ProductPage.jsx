import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductPage() {
  const navigate = useNavigate();
  const [price, setPrice] = useState("100"); // 初期値100円
  const productName = "サンプル商品";

  function goToPayment() {
    navigate(`/payment?name=${encodeURIComponent(productName)}&price=${price}`);
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>商品ページ</h1>
      <p>商品名: {productName}</p>
      <label>
        金額: 
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
        円
      </label>
      <br />
      <button onClick={goToPayment} style={{ marginTop: "1rem" }}>
        暗号資産で決済へ進む
      </button>
    </div>
  );
}

