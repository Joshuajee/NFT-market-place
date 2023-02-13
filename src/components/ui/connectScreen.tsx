import { Box, Grid, Typography } from "@mui/material";
import ConnectionBtn from "../connection/button";

const ConnectScreen = () => {

    return (
        <Grid justifyContent={"center"} alignContent={"center"} container sx={{ height: "calc(100vh - 80px)" }}>
            <Grid item sm={12} md={6} lg={4} xl={3}>
                <Box sx={{display: "flex", flexDirection: "column"}}>
                    <lottie-player 
                        src="https://assets1.lottiefiles.com/packages/lf20_b8rtfk3s.json"  
                        background="transparent"  
                        speed="1"  loop  autoplay />

                    <Typography textAlign={"center"} variant="h5">Please Connect Your Wallet </Typography>
                </Box>
            </Grid>
        </Grid>
    );
};

export default ConnectScreen;
