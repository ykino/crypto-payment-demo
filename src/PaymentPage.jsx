import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";

export default function PaymentPage() {
  const query = new URLSearchParams(useLocation().search);
  const productName = query.get("name");
  const priceYen = query.get("price"); // 円建て価格

  const [token, setToken] = useState("USDT");
  const [status, setStatus] = useState("");
  const [usdRate, setUsdRate] = useState(150); // デフォルト150円/ドル
  const [rateSource, setRateSource] = useState("固定値 (150円/ドル)");

  // CoinGecko APIからドル円レート取得
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
      } catch (err) {
        console.error("為替レート取得失敗:", err);
        setRateSource("固定値 (150円/ドル) 使用中");
      }
    }
    fetchRate();
  }, []);

  // 支払い金額を計算
  const payAmount = useMemo(() => {
    if (token === "USDT") {
      return (Number(priceYen) / usdRate).toFixed(2); // 小数2桁
    } else {
      return priceYen; // JPYCは円のまま
    }
  }, [token, priceYen, usdRate]);

  // Polygon上のトークン情報
  const TOKENS = {
    USDT: { 
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // Polygon USDT
      decimals: 6 
    },
    JPYC: { 
      address: "0x6AE7DF9F3a8f38e0687e8b3f71c198e0a6c4d32d", // Polygon JPYC
      decimals: 18 
    }
  };

  // ✅ 受け取りウォレットアドレス
  const recipient = "0xE395Bf0a4a48E0C7037d7c173a66bC2544d6e8DA";

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
    } catch (err) {
      setStatus("❌ エラー: " + err.message);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>決済ページ</h1>
      <p>商品: {productName}</p>
      <p>元の金額（円）: {priceYen} 円</p>
      <p>
        支払金額: {payAmount} {token}
      </p>
      {token === "USDT" && (
        <p style={{ color: "gray" }}>
          現在のUSDT/JPYレート: {usdRate} 円（{rateSource}）
        </p>
      )}

      <label>
        支払いトークン:
        <select value={token} onChange={(e) => setToken(e.target.value)}>
          <option value="USDT">USDT</option>
          <option value="JPYC">JPYC</option>
        </select>
      </label>
      <br />
      <button onClick={handlePayment} style={{ marginTop: "1rem" }}>
        決済実行
      </button>
      <p>{status}</p>
    </div>
  );
}

