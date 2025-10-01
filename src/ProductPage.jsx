import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductPage() {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "シンプルTシャツ",
      price: 2000,
      image: "https://picsum.photos/500/600?shirt"
    },
    {
      id: 2,
      name: "デニムパンツ",
      price: 4500,
      image: "https://picsum.photos/500/600?jeans"
    },
    {
      id: 3,
      name: "スニーカー",
      price: 6000,
      image: "https://picsum.photos/500/600?sneaker"
    },
    {
      id: 4,
      name: "トートバッグ",
      price: 3500,
      image: "https://picsum.photos/500/600?bag"
    }
  ];

  function goToPayment(product) {
    navigate(`/payment?name=${encodeURIComponent(product.name)}&price=${product.price}`);
  }

  return (
    <div style={{ 
      backgroundColor: "#fff",
      minHeight: "100vh",
      padding: "2rem"
    }}>
      <h1 style={{ 
        textAlign: "center", 
        marginBottom: "2rem", 
        fontWeight: "normal",
        fontSize: "1.8rem"
      }}>
        ファッションアイテム
      </h1>
      <div style={{ 
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "2rem",
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        {products.map((product) => (
          <div key={product.id} style={{
            textAlign: "center",
            cursor: "pointer"
          }}>
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ 
                width: "100%", 
                borderRadius: "4px",
                marginBottom: "0.8rem" 
              }} 
            />
            <h2 style={{ 
              fontSize: "1rem", 
              fontWeight: "normal", 
              margin: "0.2rem 0" 
            }}>
              {product.name}
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#333", margin: "0.2rem 0" }}>
              ¥{product.price.toLocaleString()}
            </p>
            <button 
              onClick={() => goToPayment(product)} 
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#111",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              暗号資産で購入
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

