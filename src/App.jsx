import React from "react";
import { ethers } from "ethers";

export default function App() {
  async function sendUSDT() {
    const tokenAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // Polygon USDT
    const recipient = "0x3f14827eBFaC85e81dE3B2005769e46C0CeA0E49"; // ←ここを必ず有効なアドレスに変更！
    const abi = ["function transfer(address to, uint256 value) returns (bool)"];

    try {
      if (!window.ethereum) {
        alert("MetaMaskをインストールしてください");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(tokenAddress, abi, signer);

      // 0.1 USDTを送金（6桁小数）
      const value = ethers.parseUnits("0.1", 6);
      const tx = await contract.transfer(recipient, value);

      console.log("Tx sent:", tx.hash);
      await tx.wait();
      alert("✅ 送金成功! TxHash: " + tx.hash);
    } catch (err) {
      console.error(err);
      alert("❌ エラー: " + err.message);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>USDT送金テスト（Polygon）</h1>
      <button onClick={sendUSDT}>0.1 USDTを送金</button>
    </div>
  );
}

