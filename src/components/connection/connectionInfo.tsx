import * as React from 'react';
import { useDisconnect } from 'wagmi'
import { styled, alpha } from '@mui/material/styles';
import { toast } from 'react-toastify'
import truncAddress from 'truncate-eth-address'
import Menu, { MenuProps } from '@mui/material/Menu';
import { Box, Button, IconButton, Typography } from '@mui/material';
import  {  MdContentCopy } from 'react-icons/md'

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 340,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));


interface IProps {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  address: String | undefined;
}

export default function ConnectionInfo(props: IProps) {

  const  { anchorEl, address, handleClose } = props

  const open = Boolean(anchorEl);

  const { disconnect } = useDisconnect()

  const copyAddress = () => {
    navigator.clipboard.writeText(String(address))
    toast.success("Address copied to clipboard")
  }

  return (
    <div>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
        'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}>
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
      </StyledMenu>
    </div>
  );
}