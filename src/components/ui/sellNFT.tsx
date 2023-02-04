import * as React from 'react';
import { useContractRead, useContractWrite } from 'wagmi'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { polygonMumbai } from "wagmi/chains";
import { IconButton, InputAdornment, Typography, TextField, Box } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { NFT_COLLECTION } from '../../libs/intefaces';
import { LoadingButton } from '@mui/lab';
import { Close } from '@mui/icons-material';
import RoyaltyTokenABI from "../../abi/RoyaltyToken.json";
import NFTMarketplaceABI from "../../abi/NFTMarketplace.json";
import { ethers } from "ethers";
import { ADDRESS } from '../../libs/types';


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
  nft: NFT_COLLECTION;
  address: ADDRESS
}

const contractAddress = String(process.env.NEXT_PUBLIC_CONTRACT)

export default function SellNFT(props: IProps) {

  const { nft, address } = props
  const [open, setOpen] = React.useState(false)
  const { contract, title, tokenId, description } = nft
  const [price, setPrice] = React.useState("0")
  const [isApproved, setIsApproved] = React.useState(false)

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };

  const approval = useContractRead({
    address: contract.address as `0x${string}`,
    abi: RoyaltyTokenABI,
    functionName: 'getApproved',
    chainId: polygonMumbai.id,
    args: [tokenId],
    enabled: open,
  })

  const listed = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: NFTMarketplaceABI,
    functionName: 'getListing',
    chainId: polygonMumbai.id,
    args: [contract.address, tokenId],
  })

  const approve = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: contract.address as `0x${string}`,
    abi: RoyaltyTokenABI,
    functionName: 'approve',
    chainId: polygonMumbai.id,
    args: [contractAddress, tokenId]
  })

  const listing = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: contractAddress as `0x${string}`,
    abi: NFTMarketplaceABI,
    functionName: 'listItem',
    chainId: polygonMumbai.id,
    args: [contract.address, tokenId, Number(price) <= 0 ? 0 : ethers.utils.parseUnits(price, 'ether')],
  })

  React.useEffect(() => {
    setIsApproved(approval.data === contractAddress)
  }, [approval.data])  

  const listForSale = isApproved ? listing?.write : approve?.write 

  const sellerAddress = (listed?.data as any)?.[1]

  return (
    <>
      <Box sx={{ position: "absolute" }}  >
        { ( sellerAddress != address) && <LoadingButton variant="contained" color="secondary" onClick={() => setOpen(true)} > Sell </LoadingButton> }
      </Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description">
        <DialogActions> <IconButton onClick={handleClose} ><Close /> </IconButton> </DialogActions>
        <DialogTitle>List your NFT to the Marketplace</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Typography variant="body1"> Name:  { title } </Typography>
            <Typography variant="body1"> TokenId: #{tokenId}</Typography>
            <Typography sx={{wordWrap: "break-word"}} variant="body1"> Contract: {contract.address}</Typography>
            <Typography variant="body1"> Description: {description}</Typography>
          </DialogContentText>
          <TextField 
            type="number"
            onChange={handleChange}
            sx={{mt: 2}} fullWidth label="Price of Token" 
            placeholder='eg 0.02 Matic'
            InputProps={{
              startAdornment: (<InputAdornment position='start'>MATIC</InputAdornment>)
            }}/>

          <LoadingButton 
            disabled={Number(price) <= 0}
            onClick={() => listForSale?.()} fullWidth 
            sx={{mt: 2, height: 50}} variant="contained">
              { isApproved ?  "List NFT to" : "Approve NFT for" } Marketplace
          </LoadingButton>
        </DialogContent>
      </Dialog>
    </>
  );
}
