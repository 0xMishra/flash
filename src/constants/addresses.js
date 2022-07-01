import abi from "../constants/Vault.json";
import stableCoinAbi from "../constants/StableCoinToken.json";

const VAULT_CCONTRACT_ADDRESS = "0x1b4D9516abBd051A571EdC798c211AAD7e473e16";
const STABLE_COIN_ADDRESS = "0xa6F4aE0b6323a287A4322836d3d3A009eB8B0447";
const ORACLE_ADDRESS = "0x33c8546DEDF479A1F7Bcb58A1006BFdf5ed1AFF6";
const VAULT_ABI = abi.abi;
const STABLE_COIN_ABI = stableCoinAbi.abi;

export {
  VAULT_CCONTRACT_ADDRESS,
  VAULT_ABI,
  STABLE_COIN_ABI,
  STABLE_COIN_ADDRESS,
};
