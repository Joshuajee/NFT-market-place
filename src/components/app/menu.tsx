import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from '../../libs/Link';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import Person2Icon from '@mui/icons-material/Person2';
import SellIcon from '@mui/icons-material/Sell';
import ConnectionBtn from '../connection/button';
import { ROUTES, ROUTES_NAME } from '../../libs/constants';
import { CreateRounded } from '@mui/icons-material';
import styles from "./../../styles/Nav.module.css";


interface IProps {
    open: boolean;
    handleClose: () => void;
}

export default function Menu(props: IProps) {

    const { open, handleClose } = props


    const list = () => (
        <Box
            sx={{ width: 280}}
            role="presentation"
            aria-label='Side Navigation'
            onClick={handleClose}
            onKeyDown={handleClose}>

            <List sx={{mt: 6}}>

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
{/* 
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
                </ListItem> */}

            </List>

        </Box>
    );

    return (
        <div>
            <React.Fragment>
                <Drawer anchor={"left"} open={open} onClose={handleClose}>
                    {list()}
                    <List className={styles.tablet_only}>
                        <Divider sx={{mt: 4, mb: 2}}/>
                        <ListItem disablePadding sx={{display: "flex", justifyContent: "center"}}>
                            <ConnectionBtn /> 
                        </ListItem>
                    </List>
                </Drawer>
            </React.Fragment>
        </div>
    );
}
