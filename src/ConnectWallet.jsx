import { useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/ethereum-provider";

export default function ConnectWallet() {
  const [account, setAccount] = useState(null);

  async function connect() {
    try {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              137: "https://polygon-rpc.com", // Polygonメインネット
            },
            chainId: 137,
          },
        },
      };

      const web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
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

