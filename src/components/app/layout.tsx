import React, { ReactComponentElement, ReactHTMLElement, ReactNode } from 'react';
import { Box, Container, Grid } from '@mui/material';
import Navbar from "./navbar"


interface IProps {
    children: ReactNode
}


export default function Layout(props: IProps) {


    return (
        <Grid container sx={{background: "red"}}>
            <Navbar />
            <Box sx={{backgroundColor: "#1E1E1E", flexGrow: "1", width: "100vw", pb: 6 }}>
                <Container maxWidth="lg">
                    {props.children}
                </Container>
            </Box>
        </Grid>
    );
}
