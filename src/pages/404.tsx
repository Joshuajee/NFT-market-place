import { Grid } from "@mui/material"
import { Dna } from 'react-loader-spinner'
import Layout from "../components/app/layout"

const NotFound = () => {

    return (
        <Layout>

            <Grid container item justifyContent={"center"} alignItems={"center"} sx={{height: "100vh", position: 'fixed', top: 0, left: 0}}>

                <Grid item>

                    <lottie-player 
                        src="https://assets2.lottiefiles.com/packages/lf20_aaesnvcw.json"  
                        background="transparent"  
                        speed="1"  loop  autoplay />


                </Grid>

            </Grid>

        </Layout>
    )
}

export default NotFound