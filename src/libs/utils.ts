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

export const convertToEther = (price: number) => {
  return `${ethers.utils.formatUnits(price.toString(), 'ether')} MATIC`
}


export const toArrayBuffer = (buffer: Buffer) => {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT

export const networkNameByChainId = (chainId: number) => {

  switch (chainId) {
    case 1:
      return "Ethereum Mainnet"
    case 5:
      return "Goerli"
    case 56:
      return "BNB Smart Chain Mainnet"
    case 97:
      return "BNB Smart Chain Testnet"
    case 137:
      return "Polygon Mainnet"
    case 80001:
      return "Mumbai"
    default:
      return "Unknown Network"
  }

}

export const NFTContract = process.env.NEXT_PUBLIC_NFT_CONTRACT