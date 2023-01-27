import React, { ReactComponentElement, ReactHTMLElement, ReactNode } from 'react';
import { Box, Container, Grid } from '@mui/material';
import Navbar from "./navbar"


interface IProps {
    children: ReactNode
}


export default function Layout(props: IProps) {


    return (
        <Grid container sx={{position: "absolute", top: 0, left: 0}}>
            <Navbar />
            <Box sx={{ backgroundColor: "#1E1E1E", height: "100vh", width: "100vw" }}>
                <Container maxWidth="lg">
                    {props.children}
                </Container>
            </Box>
        </Grid>
    );
}
