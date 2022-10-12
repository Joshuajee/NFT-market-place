import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import Toast, { ALERT_TYPES } from "../Alerts";
import { Button, Typography } from "@mui/material";
import { ThumbUp } from '@mui/icons-material';


interface IProps {
    setStage: (number: number) => void;
    handleClose: () => void;
}

const Success = (props: IProps) => {

    const { handleClose } = props;

    return (
        <div 
        style={{     
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: 320
            }}>

                            
            <ThumbUp color={"success"} sx={{width: "200px", height: "200px"}} />

            <Typography textAlign={"center"} sx={{maxWidth: "100%", maxHeight: 320}}>
                Your NFT has been minted Refreash the Page and Scroll Down to see it
            </Typography>

            <Button 
                sx={{width: "100%", marginTop: "1em"}} 
                variant={"contained"}
                onClick={handleClose}
                > 
                Done
            </Button> 

        </div>
    );
};

export default Success;
