import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Link from '../../libs/Link';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import Person2Icon from '@mui/icons-material/Person2';
import SellIcon from '@mui/icons-material/Sell';
import ConnectionBtn from '../connection/button';
import { ROUTES, ROUTES_NAME } from '../../libs/constants';
import { CreateRounded } from '@mui/icons-material';
import styles from "./../../styles/Nav.module.css";
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import truncateEthAddress from 'truncate-eth-address';
import { networkNameByChainId } from '../../libs/utils';
import { Button } from '@mui/material';
import { ADDRESS } from '../../libs/types';


interface IProps {
    open: boolean;
    handleClose: () => void;
}

export default function Menu(props: IProps) {

    const { isConnected, address } = useAccount()
    const { chain } = useNetwork()
    const { disconnect } = useDisconnect()

    const { open, handleClose } = props


    const list = () => (
        <Box
            sx={{ width: 280}}
            role="presentation"
            aria-label='Side Navigation'>

            <List sx={{mt: 6}} onClick={handleClose} onKeyDown={handleClose}>

                <ListItem disablePadding>
                    <ListItemButton LinkComponent={Link} href={ROUTES.MARKET_PLACE}>
                        <ListItemIcon>
                            <LocalGroceryStoreIcon />
                        </ListItemIcon>
                        <ListItemText primary={ROUTES_NAME.MARKET_PLACE} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton LinkComponent={Link} href={ROUTES.SELL_NFT}>
                        <ListItemIcon>
                            <SellIcon />
                        </ListItemIcon>
                        <ListItemText primary={ROUTES_NAME.SELL_NFT} />
                    </ListItemButton>
                </ListItem>
 
                <ListItem disablePadding>
                    <ListItemButton LinkComponent={Link} href={ROUTES.MINT_NFT}>
                        <ListItemIcon>
                            <CreateRounded />
                        </ListItemIcon>
                        <ListItemText primary={ROUTES_NAME.MINT_NFT} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton LinkComponent={Link} href={ROUTES.MY_PROFILE}>
                        <ListItemIcon>
                            <Person2Icon />
                        </ListItemIcon>
                        <ListItemText primary={ROUTES_NAME.MY_PROFILE} />
                    </ListItemButton>
                </ListItem> 

            </List>

            <Grid sx={{position: "absolute", bottom: 8}}>
                { !isConnected ?  
                    <Box sx={{ ml: 7}}> <ConnectionBtn />  </Box>: (
                        <Button sx={{width: 200, ml: 5}} variant='contained' color="error" onClick={() => disconnect()}>
                            Disconnect
                        </Button>
                    ) 
                } 
            
            </Grid>

        </Box>
    );

    return (
        <div>
            <React.Fragment>
                <Drawer anchor={"left"} open={open} onClose={handleClose}>
                    {list()}
                    <List className={styles.tablet_only} sx={{display: "block"}}>
                       
                        <Divider sx={{mt: 4, mb: 2}}/>
                       
                        <ListItem disablePadding sx={{display: "flex", justifyContent: "center"}}>
                            { 
                                isConnected && (
                                    <Box width={180} sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                        <p>Account: {truncateEthAddress(address as string)} </p> 
                                        <p>Network: {networkNameByChainId(chain?.id as number)} </p>
                                        <p>Chain ID: {chain?.id} </p>
                                    </Box>)
                            }
                        </ListItem>
    
                    </List>
                </Drawer>
            </React.Fragment>
        </div>
    );
}
