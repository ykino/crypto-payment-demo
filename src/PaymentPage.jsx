import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";

export default function PaymentPage() {
  const query = new URLSearchParams(useLocation().search);
  const productName = query.get("name");
  const priceYen = query.get("price");

  const [token, setToken] = useState("USDT");
  const [status, setStatus] = useState("");
  const [usdRate, setUsdRate] = useState(150);
  const [rateSource, setRateSource] = useState("固定値 (150円/ドル)");
  const [balance, setBalance] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [history, setHistory] = useState([]);

  // 履歴の読み込み
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("paymentHistory") || "[]");
    setHistory(saved);
  }, []);

  // CoinGeckoからレート取得
  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=jpy"
        );
        const data = await res.json();
        if (data.tether && data.tether.jpy) {
          setUsdRate(data.tether.jpy);
          setRateSource("CoinGeckoから取得");
        }
      } catch {
        setRateSource("固定値 (150円/ドル) 使用中");
      }
    }
    fetchRate();
  }, []);

  // 支払い金額
  const payAmount = useMemo(() => {
    if (token === "USDT") {
      return (Number(priceYen) / usdRate).toFixed(2);
    } else {
      return priceYen;
    }
  }, [token, priceYen, usdRate]);

  const TOKENS = {
    USDT: { 
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", 
      decimals: 6 
    },
    JPYC: { 
      address: "0x6AE7DF9F3a8f38e0687e8b3f71c198e0a6c4d32d", 
      decimals: 18 
    }
  };

  const recipient = "0xE395Bf0a4a48E0C7037d7c173a66bC2544d6e8DA";

  // 残高取得
  async function fetchBalance(selectedToken) {
    try {
      if (!window.ethereum) return;
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);

      const tokenInfo = TOKENS[selectedToken];
      const contract = new ethers.Contract(
        tokenInfo.address,
        ["function balanceOf(address owner) view returns (uint256)"],
        signer
      );

      const rawBalance = await contract.balanceOf(address);
      setBalance(ethers.formatUnits(rawBalance, tokenInfo.decimals));
    } catch {
      setBalance("0");
    }
  }

  useEffect(() => {
    fetchBalance(token);
  }, [token]);

  // 履歴を追加
  function addHistory(entry) {
    const newHistory = [entry, ...history];
    setHistory(newHistory);
    localStorage.setItem("paymentHistory", JSON.stringify(newHistory));
  }

  // 決済実行
  async function handlePayment() {
    try {
      if (!window.ethereum) {
        alert("MetaMaskをインストールしてください");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tokenInfo = TOKENS[token];
      const contract = new ethers.Contract(tokenInfo.address, [
        "function transfer(address to, uint256 value) returns (bool)"
      ], signer);

      const value = ethers.parseUnits(payAmount.toString(), tokenInfo.decimals);

      setStatus("送金中...");
      const tx = await contract.transfer(recipient, value);
      setStatus("送信: " + tx.hash);
      await tx.wait();
      setStatus("✅ 決済完了! TxHash: " + tx.hash);

      // 履歴に保存
      addHistory({
        product: productName,
        token,
        amount: payAmount,
        txHash: tx.hash,
        time: new Date().toLocaleString()
      });
    } catch (err) {
      setStatus("❌ エラー: " + err.message);
    }
  }

  return (
    <div style={{ 
      backgroundColor: "#f5f5f5", 
      minHeight: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center" 
    }}>
      <div style={{ 
        backgroundColor: "#fff", 
        borderRadius: "12px", 
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)", 
        padding: "2rem", 
        width: "420px" 
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>決済ページ</h1>

        <p><strong>商品:</strong> {productName}</p>
        <p><strong>元の金額:</strong> {priceYen} 円</p>
        <p><strong>支払金額:</strong> {payAmount} {token}</p>
        {token === "USDT" && (
          <p style={{ color: "gray", fontSize: "0.9rem" }}>
            現在のUSDT/JPYレート: {usdRate} 円（{rateSource}）
          </p>
        )}

        {userAddress && (
          <div style={{ 
            backgroundColor: "#f9f9f9", 
            borderRadius: "8px", 
            padding: "0.8rem", 
            marginTop: "1rem", 
            fontSize: "0.9rem" 
          }}>
            <p><strong>あなたのアドレス:</strong><br />{userAddress}</p>
            <p><strong>{token} 残高:</strong> {balance}</p>
          </div>
        )}

        <div style={{ marginTop: "1rem" }}>
          <label><strong>支払いトークン:</strong></label><br />
          <select 
            value={token} 
            onChange={(e) => setToken(e.target.value)} 
            style={{ 
              marginTop: "0.5rem", 
              padding: "0.4rem", 
              borderRadius: "6px", 
              border: "1px solid #ccc", 
              width: "100%" 
            }}
          >
            <option value="USDT">USDT</option>
            <option value="JPYC">JPYC</option>
          </select>
        </div>

        <button 
          onClick={handlePayment} 
          style={{ 
            marginTop: "1.5rem", 
            width: "100%", 
            padding: "0.8rem", 
            backgroundColor: "#0070f3", 
            color: "white", 
            border: "none", 
            borderRadius: "8px", 
            fontSize: "1rem", 
            cursor: "pointer" 
          }}
        >
          決済実行
        </button>

        <p style={{ marginTop: "1rem", textAlign: "center", color: "#333" }}>
          {status}
        </p>

        {/* 履歴セクション */}
        <hr style={{ margin: "1.5rem 0" }} />
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>支払い履歴</h2>
        {history.length === 0 ? (
          <p style={{ fontSize: "0.9rem", color: "#666" }}>まだ支払い履歴はありません。</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {history.map((h, i) => (
              <li key={i} style={{ 
                backgroundColor: "#f9f9f9", 
                borderRadius: "8px", 
                padding: "0.8rem", 
                marginBottom: "0.8rem", 
                fontSize: "0.9rem" 
              }}>
                <div><strong>{h.product}</strong> - {h.amount} {h.token}</div>
                <div>{h.time}</div>
                <a 
                  href={`https://polygonscan.com/tx/${h.txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: "#0070f3", fontSize: "0.85rem" }}
                >
                  Tx: {h.txHash.slice(0, 12)}...
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

