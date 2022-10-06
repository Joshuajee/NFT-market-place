/* eslint-disable @next/next/no-img-element */
import { LoadingButton } from "@mui/lab";
import { useRef, useState } from "react";
import Toast, { ALERT_TYPES } from "../Alerts";
import { Typography } from "@mui/material";
import { ethers } from 'ethers';
import abi from "../../../src/libs/abi.json";


interface IProps {
    setStage: (number: number) => void;
    selectedImage: any;
}

const Mint = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<ALERT_TYPES>(null);
    const [toast, setToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");

    const { setStage, selectedImage } = props


    async function mintNFT() {

        setLoading(true)
  
        //Upload data to IPFS
        try {

            const metadataURL = "https://ipfs.io/ipfs/QmRJVFeMrtYS2CUVUM2cHJpBV5aX2xurpnsfZxLTTQbiD3?filename=party_bull.json"
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            //Pull the deployed contract instance
            const contract = new ethers.Contract(String(process.env.NEXT_PUBLIC_CONTRACT), abi, signer)

            //massage the params to be sent to the create NFT request
            const price = ethers.utils.parseUnits("0.01", 'ether')
            const listingPrice = (await contract.getListPrice()).toString()

            console.log("meta", metadataURL)
            console.log(price)
            console.log(listingPrice)

            //actually create the NFT
            let transaction = await contract.createToken(metadataURL, price, { value: listingPrice })
            await transaction.wait()

            // updateMessage("");
            // updateFormParams({ name: '', description: '', price: ''});
        }
        catch(e) {
            //alert( "Upload error"+e )
        }

        setLoading(false)

    }


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

            {/* <img   
                onClick={handleClick}                      
                src={URL.createObjectURL(selectedImage)}
                style={{ maxWidth: "100%", maxHeight: 250, cursor: 'pointer' }}
                alt="Thumb"
                />
         */}
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
