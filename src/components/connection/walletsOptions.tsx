import {  useConnect, useAccount } from 'wagmi'
import {  Typography, Box  } from '@mui/material'
import Dropdown from '../ui/dropdown'
import Wallet from './wallet'
import { toast } from 'react-toastify';

interface IProps {
    anchorEl: null | HTMLElement;
    handleClose: () => void;
}


const WalletOptions = (props: IProps) => {

    const {anchorEl, handleClose} = props

    const { isConnected } = useAccount()

    const { connectors, error } = useConnect()

    if (isConnected) handleClose()

    if (error) {
        toast(error.message)
        handleClose()
    }

    return (
        <Dropdown anchorEl={anchorEl} handleClose={handleClose}>
            <Box sx={{}}>
                <Typography sx={{ pl: 2 }} variant='subtitle1'>Choose Wallet</Typography>
                <Box sx={{p: 2 }} gap={2} > 
                    {
                        connectors.map((connector, index) => {
                            return <Wallet key={index} connector={connector} /> 
                        })
                    }
                </Box> 
            </Box>
        </Dropdown>
    )
}

export default WalletOptions