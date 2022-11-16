import Footer from "./components/footer";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Loader from "./components/loader";
import {
  VAULT_CCONTRACT_ADDRESS,
  VAULT_ABI,
  STABLE_COIN_ABI,
  STABLE_COIN_ADDRESS,
} from "./constants/addresses";
import Navbar from "./components/navbar";

import GetStarted from "./components/getStarted";
function App() {
  const { ethereum } = window;
  const [account, setAccount] = useState();
  const [tokenAdded, setTokenAdded] = useState(false);
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const [ethToDeposit, setEthToDeposit] = useState("");
  const [tokenToRepay, setTokenToRepay] = useState("");
  const [walletEthBalance, setWalletEthBalance] = useState("");
  const [walletNDLBalance, setWalletNDLBalance] = useState("");

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
      checkTokenBalances();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const getCurrentAccount = async () => {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        checkTokenBalances();
      } else {
        setAccount("");
      }
    });
  };

  const getConnectedWallet = async () => {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    const web3Provider = new ethers.providers.Web3Provider(ethereum);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }

    if (accounts.length) {
      setAccount(accounts[0]);
      checkTokenBalances();
    } else {
      console.log("no accounts found");
    }
  };

  const depositEth = async (e) => {
    try {
      e.preventDefault();
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const vaultContract = new ethers.Contract(
        VAULT_CCONTRACT_ADDRESS,
        VAULT_ABI,
        signer
      );
      setIsDepositLoading(true);
      const depositEtHTxn = await vaultContract.deposit(
        (ethToDeposit * 10 ** 18).toString(),
        {
          value: ethers.utils.parseEther(ethToDeposit),
        }
      );
      await depositEtHTxn.wait();
      setIsDepositLoading(false);
      checkTokenBalances();
    } catch (error) {
      console.log(error);
      setIsDepositLoading(false);
      setEthToDeposit("");
      checkTokenBalances();
    }
  };

  const withdarawEth = async (e) => {
    try {
      e.preventDefault();
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const vaultContract = new ethers.Contract(
        VAULT_CCONTRACT_ADDRESS,
        VAULT_ABI,
        signer
      );
      setIsWithdrawLoading(true);
      const withdrawEtHTxn = await vaultContract.withdraw(
        (tokenToRepay * 10 ** 18).toString()
      );
      await withdrawEtHTxn.wait();
      setIsWithdrawLoading(false);
      checkTokenBalances();
    } catch (error) {
      console.log(error);
      setIsWithdrawLoading(false);
      setTokenToRepay("");
      checkTokenBalances();
    }
  };

  const checkTokenBalances = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const stableTokenContract = new ethers.Contract(
        STABLE_COIN_ADDRESS,
        STABLE_COIN_ABI,
        signer
      );
      const ethBalance = await provider.getBalance(signer.getAddress());
      if (ethBalance) {
        setWalletEthBalance(ethBalance / 10 ** 18);
      }
      const ndlBalance = await stableTokenContract.balanceOf(
        signer.getAddress()
      );
      if (!ndlBalance) {
        addTokenFunction();
      } else {
        setWalletNDLBalance(ndlBalance / 10 ** 18);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentAccount();
    getConnectedWallet();
  }, [account]);

  useEffect(() => {
    checkTokenBalances();
  }, [walletEthBalance, walletNDLBalance]);

  async function addTokenFunction() {
    try {
      const tokenAddress = STABLE_COIN_ADDRESS;
      const tokenSymbol = "NDL";
      const tokenDecimals = 18;
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
          },
        },
      });

      if (wasAdded) {
        setTokenAdded(true);
        console.log("Thanks for your interest!");
      } else {
        console.log("New Delhi Coin has not been added");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Navbar account={account} connectWallet={connectWallet} />

      <section className="flex justify-center items-center ">
        <div className="w-[90vw] max-w-[900px] ">
          <GetStarted
            tokenAdded={tokenAdded}
            addTokenFunction={addTokenFunction}
            walletNDLBalance={walletNDLBalance}
          />
        </div>
      </section>

      <section className="w-full flex flex-col justify-start items-center  mt-4 my-4">
        <form className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
          <p className="text-white font-bold mb-3">
            ETH Balance: {walletEthBalance.toString()}
          </p>
          <input
            placeholder="ETH Amount To Deposit"
            name="eth"
            type="text"
            value={ethToDeposit}
            className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
            onChange={(e) => setEthToDeposit(e.target.value)}
          />

          {isDepositLoading ? (
            <Loader />
          ) : (
            <button
              type="button"
              className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer mb-10"
              onClick={(e) => depositEth(e)}
            >
              Deposit ETH
            </button>
          )}
          <div className="h-[1px] w-full bg-gray-400 my-2 " />
          <p className="text-white font-bold mt-10 mb-3">
            NDL Balance: {walletNDLBalance.toString()}
          </p>

          <input
            placeholder="Token Amount To Repay "
            name="token"
            type="text"
            value={tokenToRepay}
            className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism "
            onChange={(e) => setTokenToRepay(e.target.value)}
          />

          {isWithdrawLoading ? (
            <Loader />
          ) : (
            <button
              type="button"
              className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
              onClick={(e) => withdarawEth(e)}
            >
              Withdraw ETH
            </button>
          )}
        </form>
      </section>

      <Footer />
    </>
  );
}

export default App;
