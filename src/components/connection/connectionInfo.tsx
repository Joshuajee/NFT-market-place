import * as React from 'react';
import { useDisconnect, useNetwork } from 'wagmi'
import { toast } from 'react-toastify'
import truncAddress from 'truncate-eth-address'
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
//import  {  MdContentCopy } from 'react-icons/md'
import Dropdown from '../ui/dropdown';
import { CgProfile } from 'react-icons/cg'
import { ROUTES } from '../../libs/constants';
import truncateEthAddress from 'truncate-eth-address';
import { networkNameByChainId } from '../../libs/utils';
import Link from '../../libs/Link';


interface IProps {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  address: String | undefined;
}

export default function ConnectionInfo(props: IProps) {

  const  { anchorEl, address, handleClose } = props

  const { chain } = useNetwork()

  const { disconnect } = useDisconnect()

  // const copyAddress = () => {
  //   navigator.clipboard.writeText(String(address))
  //   toast.success("Address copied to clipboard")
  // }

  return (
    <Dropdown anchorEl={anchorEl} handleClose={handleClose}>
      <Box>
        <Typography sx={{mx: 1, borderBottom: 1, borderColor: "gray"}} variant='subtitle1'>ACTIVE ACCOUNT</Typography>
        <Box sx={{px: 2}}>

          <Grid sx={{mt: 2}} container flexDirection={"column"} justifyContent={"center"} alignItems={"center"}> 
            
            <IconButton component={Link} href={ROUTES.MY_PROFILE}> <CgProfile size={34} /> </IconButton> 

            <Typography 
              component={Link}
              href={ROUTES.MY_PROFILE}
              sx={{color: "white",  textDecoration: 'none'}} 
              >My Profile 
            </Typography>

            { address &&
              <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <p>Account: {truncateEthAddress(address as string)} </p> 
                <p>Network: {networkNameByChainId(chain?.id as number)} </p>
                <p>Chain ID: {chain?.id} </p>
              </Box>
            } 

          </Grid>

          <Box sx={{pt: 1, display: "flex", justifyContent: "space-between", alignItems: "center"}}> 
            
            {/* <Typography>Network: {networkNameByChainId(chain?.id as number)} </Typography>

            <Typography>Chain ID: {chain?.id} </Typography> */}


            {/* <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
              <p className='mr-2'>{truncAddress(String(address))} </p>
              <IconButton onClick={copyAddress}>
                <MdContentCopy />
              </IconButton>
            </Box> */}
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