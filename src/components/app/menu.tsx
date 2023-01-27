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
            onClick={handleClose}
            onKeyDown={handleClose}
            >
            <List>

                <ListItem disablePadding>
                    <ListItemButton LinkComponent={Link} href="/profile">
                        <ListItemIcon>
                            <Person2Icon />
                        </ListItemIcon>
                        <ListItemText primary={"Profile"} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton LinkComponent={Link} href="/">
                        <ListItemIcon>
                            <LocalGroceryStoreIcon />
                        </ListItemIcon>
                        <ListItemText primary={"MarketPlace"} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton LinkComponent={Link} href="/sell-nft">
                        <ListItemIcon>
                            <SellIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Sell NFT"} />
                    </ListItemButton>
                </ListItem>

            </List>

        </Box>
    );

    return (
        <div>
            <React.Fragment>
                <Drawer anchor={"left"} open={open} onClose={handleClose}>
                    {list()}
                </Drawer>
            </React.Fragment>
        </div>
    );
}
