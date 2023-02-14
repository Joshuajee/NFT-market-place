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
                    value={details.description}
                    onChange={(e) => setDetails({ ...details, description: e.target.value })}
                    sx={{marginTop: "0.6em", width: "100%"}}
                    />
            </FormControl>
        </Box>
    );

};

export default Description;
