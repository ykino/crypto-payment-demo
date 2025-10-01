import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductPage() {
  const navigate = useNavigate();

  // 一般消費者向けの商品リスト
  const products = [
    {
      id: 1,
      name: "コーヒーマグカップ",
      description: "毎日のコーヒーにぴったりのシンプルなマグカップ。",
      price: 800,
      image: "https://picsum.photos/400/250?coffee"
    },
    {
      id: 2,
      name: "エコバッグ",
      description: "買い物や普段使いに便利な折りたたみ式エコバッグ。",
      price: 500,
      image: "https://picsum.photos/400/250?bag"
    },
    {
      id: 3,
      name: "Bluetoothイヤホン",
      description: "軽量で使いやすいワイヤレスイヤホン。",
      price: 2500,
      image: "https://picsum.photos/400/250?earphone"
    },
    {
      id: 4,
      name: "ノートとペンセット",
      description: "勉強や仕事に便利なノートとペンのセット。",
      price: 600,
      image: "https://picsum.photos/400/250?notebook"
    }
  ];

  function goToPayment(product) {
    navigate(`/payment?name=${encodeURIComponent(product.name)}&price=${product.price}`);
  }

  return (
    <div style={{ 
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
      padding: "2rem"
    }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>商品一覧</h1>
      <div style={{ 
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1.5rem",
        maxWidth: "900px",
        margin: "0 auto"
      }}>
        {products.map((product) => (
          <div key={product.id} style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "1rem",
            textAlign: "center"
          }}>
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ 
                width: "100%", 
                borderRadius: "8px", 
                marginBottom: "1rem" 
              }} 
            />
            <h2 style={{ margin: "0.5rem 0" }}>{product.name}</h2>
            <p style={{ color: "#555", fontSize: "0.9rem" }}>{product.description}</p>
            <p style={{ fontWeight: "bold", margin: "0.5rem 0" }}>
              {product.price} 円
            </p>
            <button 
              onClick={() => goToPayment(product)} 
              style={{
                marginTop: "0.5rem",
                width: "100%",
                padding: "0.7rem",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer"
              }}
            >
              暗号資産で決済へ進む
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

