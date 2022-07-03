import React from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { AiFillPlayCircle } from "react-icons/ai";

const NavBarItem = ({ title, classprops }) => (
  <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>
);

const Navbar = ({ account, connectWallet }) => {
  const [toggleMenu, setToggleMenu] = React.useState(false);

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4 mb-3">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <i className="text-white font-bold text-5xl ">FLASH</i>
      </div>
      <ul className="text-white md:flex  list-none flex-row justify-between items-center flex-initial">
        <li className="hidden md:flex">
          {[
            <a
              href="https://twitter.com/0xMishra"
              target="_blank"
              className="text-white text-base text-center mx-2 cursor-pointer"
            >
              Twitter
            </a>,
            <a
              href="http://discordapp.com/users/769610841912770560"
              target="_blank"
              className="text-white text-base text-center mx-2 cursor-pointer"
            >
              Discord
            </a>,
            <a
              href="https://github.com/mishra811/flash"
              target="_blank"
              className="text-white text-base text-center mx-2 cursor-pointer"
            >
              Github
            </a>,
          ].map((item, index) => (
            <NavBarItem key={item + index} title={item} />
          ))}
        </li>
        <li>
          {account ? (
            <p className="text-white text-xl font-bold">
              {account.slice(0, 4) + "..." + account.slice(39, 42)}
            </p>
          ) : (
            <button
              type="button"
              onClick={connectWallet}
              className="flex flex-row justify-center items-center  bg-[#2952e3] p-2 rounded-full cursor-pointer hover:bg-[#2546bd]"
            >
              <AiFillPlayCircle className="text-white mr-2" />
              <p className="text-white text-base font-semibold">
                Connect Wallet
              </p>
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
