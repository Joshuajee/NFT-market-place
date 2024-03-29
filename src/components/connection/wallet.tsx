import Image from 'next/image';
import { Connector, useConnect } from 'wagmi'
import { toast } from 'react-toastify'
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';


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

interface IProps {
    connector: Connector
}

const Wallet = (props: IProps) => {

    const { connector } = props

    const { connect, error  } = useConnect()

    if (error) toast(error.message)

    const icon = (id: string) => {
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


export default Wallet