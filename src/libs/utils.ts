import { ethers } from "ethers";

export const truncateAddress = (address: string) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};
  
export const toHex = (num: number) => {
  const val = Number(num);
  return "0x" + val.toString(16);
};

export const verifyAddress = (address: string) => {
  return ethers.utils.isAddress(address.trim());
}
  
export const getNFTUrl = (url: string) => {

  const ipfs = 'https://ipfs.io/ipfs/'

  const filebase = 'https://ipfs.filebase.io/ipfs/'

  if (url.startsWith('ipfs://')) return `${ipfs}${url.slice(6, url.length)}`

  if (url.startsWith(filebase)) return `${ipfs}${url.slice(filebase.length, url.length)}`

  return url
}