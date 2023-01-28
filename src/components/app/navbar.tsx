import React, { useState } from 'react';
import { Grid, AppBar, Toolbar, useScrollTrigger, Typography, IconButton, Box, Container } from '@mui/material';
import Hamburger from 'hamburger-react';
import ConnectionBtn from "./../connection/button"
import Link from '../../libs/Link';
import styles from "./../../styles/Nav.module.css";
import Search from './search';
import Menu from './menu';
import { SearchRounded } from '@mui/icons-material';
import { ROUTES, ROUTES_NAME } from '../../libs/constants';


interface Props {
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

    const [showSearch, setShowSearch] = useState(false)

    const handleClick = () => {
        setOpen(!open)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const removeSearchBar =() => {
        setShowSearch(false)
    }

    const normalNav = (
        <Grid container justifyContent={"space-between"}>

            <Grid item md={3} lg={2}> 
                <Typography variant='h6' sx={{fontWeight: 700, lineHeight: 2.5}}>  JEE Marketplace </Typography>                            
            </Grid>

            <Grid item md={3} lg={4} aria-label={"search container"} className={styles.hide_mobile}>
                <Search />
            </Grid>

            <Grid item md={4} aria-label={"link container"} className={styles.hide}>
                <Grid container sx={{color: "white"}} justifyContent="center">
                    <Link className={styles.link} sx={{color: "white"}} href={ROUTES.MARKET_PLACE}> { ROUTES_NAME.MARKET_PLACE } </Link>
                    <Link className={styles.link} sx={{color: "white"}} href={ROUTES.SELL_NFT}> { ROUTES_NAME.SELL_NFT } </Link>
                    <Link className={styles.link} sx={{color: "white"}} href={ROUTES.MINT_NFT}> { ROUTES_NAME.MINT_NFT} </Link> 
                    {/* <Link className={styles.link} sx={{color: "white"}} href={ROUTES.MY_PROFILE}> { ROUTES_NAME.MY_PROFILE} </Link> */}
                </Grid>
            </Grid>

            <Grid aria-label={"connection container"} item md={2} lg={2} className={styles.hide}>
                <Grid container sx={{height: "100%"}} justifyContent="center" alignItems="center">
                    <ConnectionBtn />
                </Grid>
            </Grid>

            <Grid aria-label={"collaspe container"} className={styles.hide_lg} item md={6}>
                <Grid container item justifyContent={"flex-end"}>
                    <IconButton className={styles.phone_only}  onClick={() => setShowSearch(true)}> 
                        <SearchRounded /> 
                    </IconButton> 
                    <Box sx={{ display: "flex", alignItems: "center", height: "100%"}} className={styles.hide_tablet}><ConnectionBtn /> </Box>
                    <Hamburger size={28} toggled={open} toggle={handleClick} />
                    <Menu open={open} handleClose={handleClose} />
                </Grid>
            </Grid>

        </Grid>
    )

    const searchNav = (
        <Search show={showSearch} close={removeSearchBar} />
    )

    return (
        <React.Fragment>
            <ElevationScroll {...props}>
                <AppBar>
                    <Toolbar sx={{px:0}}>
                        <Container maxWidth="xl">
                            {   !showSearch ? normalNav : searchNav  }
                        </Container>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <Toolbar />
        </React.Fragment>
    );
}
