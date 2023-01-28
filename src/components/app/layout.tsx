import React, { ReactComponentElement, ReactHTMLElement, ReactNode } from 'react';
import { Box, Container, Grid } from '@mui/material';
import Navbar from "./navbar"


interface IProps {
    children: ReactNode
}


export default function Layout(props: IProps) {


    return (
        <Grid container sx={{position: "absolute", top: 0, left: 0}}>
            <Container maxWidth="lg">
                <Navbar />
            </Container> 
            <Box sx={{ width: "100vw", pb: 6 }}>
                <Container maxWidth="lg">
                    {props.children}
                </Container>
            </Box>
        </Grid>
    );
}
