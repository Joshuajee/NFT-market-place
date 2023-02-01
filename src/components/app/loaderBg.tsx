import { Grid } from "@mui/material"
import { Dna } from 'react-loader-spinner'

const LoadingBG = () => {

    return (
        <Grid container item justifyContent={"center"} alignItems={"center"} sx={{height: "100vh", position: 'fixed', top: 0, left: 0}}>

            <Grid item>

            <Dna
                visible={true}
                height="80"
                width="80"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
                />
            </Grid>

        </Grid>
    )
}

export default LoadingBG