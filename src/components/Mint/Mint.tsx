/* eslint-disable @next/next/no-img-element */
import { LoadingButton } from "@mui/lab";
import { useEffect, useRef, useState } from "react";
import Toast, { ALERT_TYPES } from "../Alerts";
import { Typography } from "@mui/material";
import { ethers } from 'ethers';
import nftAbi from "../../../src/libs/nftAbi.json";
import { getAddress } from "../../libs/utils";


interface IProps {
    setStage: (number: number) => void;
    selectedImage: any;
}

const Mint = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<ALERT_TYPES>(null);
    const [toast, setToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [address, setAddress] = useState<string | null>(null);

    const { setStage, selectedImage } = props


    async function mintNFT() {

        setLoading(true)
  

        try {

            const metadataURL = `https://ipfs.io/ipfs/${sessionStorage.getItem("json")}`
            
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window?.ethereum);
            const signer = provider.getSigner();

            //Pull the deployed contract instance
            const contract = new ethers.Contract(String(process.env.NEXT_PUBLIC_NFT_CONTRACT), nftAbi, signer)

            console.log("meta", metadataURL)

            //actually create the NFT
            const transaction = await contract.royaltyMint(address, metadataURL, 0)
            
            await transaction.wait()

            setStage(3)

        } catch(e) {
            //alert( "Upload error"+e )
            //setToastMsg(Error(e)?.message)
        }

        setLoading(false)

    }

    useEffect(() => {
        getAddress(setAddress);
    }, [])


    const handleClick = async () => {
        setLoading(true)

        try {
            const res = await mintNFT()
            console.log(res)
            setStage(3)
        } catch (e: any) {
            setToastMsg(e?.message)
        }
        
        setLoading(false)
    }


    return (
        <div 
            style={{     
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: 360
            }}>
            
            <Typography variant={"h6"} sx={{marginBottom: "1em"}}> Mint Your NFT Now</Typography>

            <img                       
                src={URL.createObjectURL(selectedImage)}
                style={{ maxWidth: "100%", maxHeight: 250, cursor: 'pointer' }}
                alt="Thumb"
                />
         
                <LoadingButton 
                    sx={{width: "100%", marginTop: "1em"}} 
                    variant={"contained"}
                    onClick={handleClick}
                    loading={loading}
                    loadingIndicator={"Minting..."}
                    > 
                    Mint Your NFT Now
                </LoadingButton> 

            <Toast type={status} open={toast} setOpen={setToast} message={toastMsg} />

        </div>
    );
};

export default Mint;
