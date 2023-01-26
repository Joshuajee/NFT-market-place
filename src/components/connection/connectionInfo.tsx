import * as React from 'react';
import { useDisconnect } from 'wagmi'
import { styled, alpha } from '@mui/material/styles';
import { toast } from 'react-toastify'
import truncAddress from 'truncate-eth-address'
import Menu, { MenuProps } from '@mui/material/Menu';
import { Box, Button, IconButton, Typography } from '@mui/material';
import  {  MdContentCopy } from 'react-icons/md'
import Dropdown from '../ui/dropdown';


interface IProps {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  address: String | undefined;
}

export default function ConnectionInfo(props: IProps) {

  const  { anchorEl, address, handleClose } = props

  const { disconnect } = useDisconnect()

  const copyAddress = () => {
    navigator.clipboard.writeText(String(address))
    toast.success("Address copied to clipboard")
  }

  return (
    <Dropdown anchorEl={anchorEl} handleClose={handleClose}>
      <Box>
        <Typography sx={{mx: 1, borderBottom: 1, borderColor: "gray"}} variant='subtitle1'>ACTIVE ACCOUNT</Typography>
        <Box sx={{px: 2}}>
          <Box sx={{pt: 1, display: "flex", justifyContent: "space-between", alignItems: "center"}}> 
            <Typography>Metamask</Typography>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
              <p className='mr-2'>{truncAddress(String(address))} </p>
              <IconButton onClick={copyAddress}>
                <MdContentCopy />
              </IconButton>
            </Box>
          </Box>
          <Button 
            fullWidth sx={{my: 1}}
            onClick={() => { disconnect(); handleClose() }} 
            variant="contained" color='error'> 
            Disconnect Wallet 
          </Button>
        </Box>
      </Box> 
    </Dropdown>
  );
}