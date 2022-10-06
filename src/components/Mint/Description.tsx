import { LoadingButton } from "@mui/lab";
import { FormControl, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";;
import Toast, { ALERT_TYPES } from "../Alerts";


interface IProps {
    setStage: (number: number) => void;
    name: string;
    description: string;
    setName: (string: string) => void;
    setDescription: (string: string) => void;
}

const Description = (props: IProps) => {

    const { name, description, setName, setDescription } = props

    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<ALERT_TYPES>(null);
    const [toast, setToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");


    const uploadData = async () => {

        const payload = {  
            title: name,  
            discription: description, 
            imageurl: `https://ipfs.io/ipfs/${sessionStorage.getItem("image")}`      
        }

        setLoading(true)
    
        try {
            
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/jsonupload`, payload)
    
            sessionStorage.setItem("json", res?.data?.IpfsHash)
    
            props.setStage(2)
            
        } catch (error) {
            setStatus("error")
            setToast(true)
            setToastMsg("An error occured")
        }
    
        setLoading(false)
    }
    

    return (
        <FormControl sx={{marginTop: "0.4em", width: "100%"}}>

            <TextField 
                label={"Name"} 
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{marginTop: "0.6em", width: "100%"}}
                InputProps={{sx:{color: "#000"}}}
                />

            <TextField 
                multiline
                label={"Description"} 
                rows={6}
                onChange={(e) => setDescription(e.target.value)}
                sx={{marginTop: "0.6em", width: "100%"}}
                InputProps={{sx:{color: "#000"}}}
                />

            <LoadingButton 
                disabled={name.length < 2 || description.length < 5}
                onClick={uploadData}
                sx={{width: "100%", marginTop: "1em"}} 
                variant={"contained"}
                loading={loading}
                loadingIndicator={"Uploading..."}> Upload
            </LoadingButton> 

            <Toast type={status} open={toast} setOpen={setToast} message={toastMsg} />

        </FormControl>
    );

};

export default Description;
