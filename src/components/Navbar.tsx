import React, { useEffect, useState } from 'react';
import { Grid, AppBar, Toolbar, useScrollTrigger, Typography } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Link from '../libs/Link';
import LoadingButton from '@mui/lab/LoadingButton';
import styles from "./../../styles/Nav.module.css";
import { ethers } from 'ethers';
import { getAddress, truncateAddress } from "./../libs/utils"
import Search from './Search';


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

    const [currAddress, updateAddress] = useState<string | null>(null);

    async function connect() {

        if (window?.ethereum) {

            const chainId = await window.ethereum.request({ method: 'eth_chainId' });

            if(chainId !== '0x5') {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x5' }],
                })
            }  
    
            await window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(() => {
                    //window.location.replace(location.pathname)
                });

        }

    }

    useEffect(() => {

        const val = window?.ethereum?.isConnected();

        if(val){
            getAddress(updateAddress);
        }

        window?.ethereum?.on('accountsChanged', function(accounts: string) {

        })

    }, []);


    return (
        <React.Fragment>

            <ElevationScroll {...props}>

                <AppBar>

                    <Toolbar>

                        <Grid container>

                            <Grid item md={2}> 
                                <Typography variant='h6' sx={{fontWeight: 700, lineHeight: 2.5}}>  JEE Marketplace </Typography>                            
                            </Grid>

                            <Grid item md={5}>

                                <Search />

                            </Grid>

                            <Grid item md={5}>

                                <Grid container sx={{color: "white"}} justifyContent="flex-end">

                                    <Link className={styles.link} sx={{color: "white"}} href="/"> MarketPlace </Link>

                                    <Link className={styles.link} sx={{color: "white"}} href="/list-nft"> List NFT </Link>

                                    <Link className={styles.link} sx={{color: "white"}} href="/profile"> Profile </Link>
                    
                                    <LoadingButton 
                                        color="warning" 
                                        onClick={ !currAddress ? connect : undefined } 
                                        className={styles.connect} 
                                        variant='contained'> 
                                        {       
                                            currAddress ? "Connected" : "Connect Wallet" 
                                        }
                                    </LoadingButton>

                                </Grid>

                            </Grid>

                        </Grid>

                    </Toolbar>

                </AppBar>

            </ElevationScroll>

            <Toolbar />

        </React.Fragment>
    );
}
