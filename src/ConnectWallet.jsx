import { useState } from "react";
import { ethers } from "ethers";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import Web3Modal from "web3modal";

export default function ConnectWallet() {
  const [account, setAccount] = useState(null);

  async function connect() {
    try {
      const providerOptions = {
        walletconnect: {
          package: EthereumProvider,
          options: {
            projectId: "783814c87013fdf816ac5dd729da58b6", // 👈 必須
            chains: [137], // Polygon Mainnet
            rpcMap: {
              137: "https://polygon-rpc.com",
            },
          },
        },
      };

      const web3Modal = new Web3Modal({
        providerOptions,
        cacheProvider: false,
      });

      const instance = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(instance);
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());
    } catch (err) {
      console.error("ウォレット接続失敗:", err);
    }
  }

  return (
    <div style={{ marginBottom: "1rem" }}>
      {account ? (
        <p>接続中: {account}</p>
      ) : (
        <button
          onClick={connect}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ウォレット接続
        </button>
      )}
    </div>
  );
}

