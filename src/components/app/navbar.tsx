import React, { useEffect, useRef, useState } from 'react';
import { Grid, AppBar, Toolbar, useScrollTrigger, Typography } from '@mui/material';
import Hamburger from 'hamburger-react';
import ConnectionBtn from "./../connection/button"
import Link from '../../libs/Link';
import styles from "./../../styles/Nav.module.css";
import Search from './search';
import Menu from './menu';


interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children?: any;
}

function ElevationScroll(props: Props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

export default function NavBar(props: Props) {

    const [open, setOpen] = useState(false)

    const handleClick = () => {
        setOpen(!open)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <React.Fragment>
            <ElevationScroll {...props}>
                <AppBar>
                    <Toolbar>
                        <Grid container justifyContent={"space-between"}>
                            <Grid item md={2}> 
                                <Typography variant='h6' sx={{fontWeight: 700, lineHeight: 2.5}}>  JEE Marketplace </Typography>                            
                            </Grid>
                            <Grid item md={5} className={styles.hide}>
                                <Search />
                            </Grid>
                            <Grid item md={5} className={styles.hide}>
                                <Grid container sx={{color: "white"}} justifyContent="flex-end">
                                    <Link className={styles.link} sx={{color: "white"}} href="/"> MarketPlace </Link>
                                    <Link className={styles.link} sx={{color: "white"}} href="/sell-nft"> List NFT </Link>
                                    <Link className={styles.link} sx={{color: "white"}} href="/profile"> Profile </Link>
                                    <ConnectionBtn />
                                </Grid>
                            </Grid>

                            <Grid item className={styles.phone_only}>
                                
                                <Hamburger size={28} toggled={open} toggle={handleClick} />

                                <Menu open={open} handleClose={handleClose} />

                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <Toolbar />
        </React.Fragment>
    );
}
