import React, { ReactNode } from 'react';
import { Box, Container, Grid } from '@mui/material';
import Navbar from "./navbar"


interface IProps {
    children: ReactNode
}


export default function Layout(props: IProps) {


    return (
        <Grid container sx={{position: "absolute", top: 0, left: 0, display: "flex", flexDirection: "column"}}>
            <Container maxWidth="lg">
                <Navbar />
            </Container> 
            <Box sx={{ pb: 6, flexGrow: 1 }}>
                <Container maxWidth="lg">
                    {props.children}
                </Container>
            </Box>
        </Grid>
    );
}
