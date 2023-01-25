import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import truncAddress from 'truncate-eth-address'
import { AiOutlineWallet } from 'react-icons/ai'
import  { RxCaretDown } from 'react-icons/rx'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { Box, Button } from '@mui/material'
import ConnectionInfo from './connectionInfo'


const ConnectionBtn = () => {

    const { address, isConnected } = useAccount()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const { connect } = useConnect({
      connector: new InjectedConnector(),
      onError: (e) =>  toast.error(e.message)
    })

    return (
        <Box sx={{display: 'flex', alignContent: 'center'}}>
            
            { 
                !isConnected &&
                    <Button sx={{}} onClick={() => connect()} variant="contained" color='success'>
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

        </Box>
    )
}

export default ConnectionBtn