import { LoadingButton } from "@mui/lab";
import { Box, Card, FormControl, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";import { NFT_DETAILS } from "../../libs/intefaces";
;

interface IProps {
    details: NFT_DETAILS;
    setDetails: (detaials: NFT_DETAILS) => void;
}

const Description = (props: IProps) => {

    const { details, setDetails } = props

    // const uploadData = async () => {

    //     const payload = {  
    //         name,  
    //         , 
    //         image: `https://ipfs.io/ipfs/${sessionStorage.getItem("image")}`      
    //     }

    //     setLoading(true)
    
    //     try {
            
    //         const res = await axios.post('/api/upload-meta', payload)
    
    //         sessionStorage.setItem("json", res?.data?.IpfsHash)
    
    //         props.setStage(2)
            
    //     } catch (error) {

    //     }
    
    //     setLoading(false)
    // }
    

    return (
        <Box>
            <FormControl sx={{marginTop: "0.4em", width: "100%"}}>
                <TextField 
                    label={"Name"} 
                    value={details.name}
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    sx={{marginTop: "0.6em", width: "100%"}}
                    />

                <TextField 
                    multiline
                    label={"Description"} 
                    rows={6}
                    onChange={(e) => setDetails({ ...details, description: e.target.value })}
                    sx={{marginTop: "0.6em", width: "100%"}}
                    />
            </FormControl>
        </Box>
    );

};

export default Description;
