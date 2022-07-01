import Secure from "../assets/images/wallet.png";
import { AiFillPlayCircle } from "react-icons/ai";

function GetStarted({ tokenAdded, addTokenFunction, walletNDLBalance }) {
  return (
    <section className="bg-mainBg text-gray-300 " id="getStarted ">
      <div className="px-4 py-10 mx-auto font-rubik sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2  mb-4">
          <div className="pt-2 lg:pt-7">
            <h2 className="font-rubik text-center sm:inline-block pb-3 font-extrabold tracking-wide text-3xl sm:text-4xl mt-4 sm:mt-7 text-gray-300 sm:leading-none">
              Welcome To
              <strong>
                <i> FLASH</i>
              </strong>{" "}
            </h2>
            <p className="font-raj text-center lg:text-left tracking-wider pt-2">
              <strong>
                <i>FLASH</i>
              </strong>{" "}
              is a Lending / Borrowing protocol. You can deposit some{" "}
              <strong>
                <i>ETH</i>
              </strong>{" "}
              and borrow{" "}
              <strong>
                <i>NDL</i>
              </strong>{" "}
              stablecoins which you can repay back and get your ETH back.
            </p>
            Every transaction made from{" "}
            <strong>
              <i>FLASH</i>
            </strong>{" "}
            is safe and secured. <br />
            <br />
            <br />
            {walletNDLBalance ? (
              ""
            ) : (
              <button
                type="button"
                onClick={addTokenFunction}
                className="flex flex-row justify-center items-center  bg-[#2952e3] p-2 rounded-full cursor-pointer hover:bg-[#2546bd]"
              >
                <AiFillPlayCircle className="text-white mr-2" />
                <p className="text-white text-base font-semibold">
                  add NDL Token
                </p>
              </button>
            )}
          </div>
          <div className="flex justify-center lg:justify-end">
            <div>
              <img
                src={Secure}
                className="w-28 h-28 sm:w-60 sm:h-60 secure-shadow"
                alt="Security"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GetStarted;
