import Image from 'next/image';
import { useConnect } from 'wagmi'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types';
import { Box, Button, Card, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { width } from '@mui/system';


const Item = styled(Paper)(({ theme }) => ({
    height: "10em",
    width: "10em",
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    minHeight: 0,
    minWidth: 0,
    cursor: "pointer",
    "&hover" : {}
}));


const Wallet = ({connector}) => {

    const { connect, error  } = useConnect()

    if (error) toast(error)

    const icon = (id) => {
        switch(id) {
            case "walletConnect":
                return  <Image alt={connect.name} src="/icons/walletconnect-logo.png" height={50} width={50} />
            case "coinbaseWallet":
                return <Image alt={connect.name} src="/icons/coinbasewallet-logo.png" height={50} width={50} />
            default:
                return  <Image alt={connect.name} src="/icons/metamask-logo.png" height={50} width={50} />
        }
    }

    return (
            <Item>
                <Box sx={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}} onClick={() => connect({ connector })}>
                    
                    <div> {icon(connector.id)} </div>
                    
                    <Typography variant='subtitle2' textAlign={"center"}> {connector.name} </Typography>

                </Box>
            </Item>
    )
}


Wallet.propTypes = {
    connector: PropTypes.object.isRequired
};


export default Wallet