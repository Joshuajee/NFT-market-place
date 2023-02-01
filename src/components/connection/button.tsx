import { useAccount } from 'wagmi'
import truncAddress from 'truncate-eth-address'
import { AiOutlineWallet } from 'react-icons/ai'
import  { RxCaretDown } from 'react-icons/rx'
import { useState } from 'react'
import { Box, Button } from '@mui/material'
import ConnectionInfo from './connectionInfo'
import WalletOptions from './walletsOptions'


const ConnectionBtn = () => {

    const { address, isConnected } = useAccount()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [anchorElOptions, setAnchorElOptions] = useState<null | HTMLElement>(null);


    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleClickOptions = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElOptions(event.currentTarget);
    };
  
    const handleCloseOptions = () => {
        setAnchorElOptions(null);
    };
  

    return (
        <Box sx={{display: 'flex', alignContent: 'center'}}>
            
            { 
                !isConnected &&
                    <Button onClick={handleClickOptions} variant="outlined">
                        Connect Wallet 
                    </Button>
            }

            {

                isConnected &&  (
                    <div style={{ cursor: 'pointer', display: 'flex', justifyContent: "center", alignItems: 'center' }} role={"button"} onClick={handleClick}>

                        <AiOutlineWallet className='mr-2' size={"2em"} />

                        <span> {truncAddress(String(address))}  </span>    

                        <RxCaretDown className='ml-2' />

                    </div>
                )

            }

            <ConnectionInfo anchorEl={anchorEl} handleClose={handleClose} address={address} />

            <WalletOptions anchorEl={anchorElOptions} handleClose={handleCloseOptions} />

        </Box>
    )
}

export default ConnectionBtn