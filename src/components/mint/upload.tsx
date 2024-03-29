import { useRef, memo} from "react";
import { Box, Grid, Typography, Card } from "@mui/material";
import { FiUpload } from "react-icons/fi";
import Image from "next/image";


interface IProps {
    selectedImage: any;
    setSelectedImage: (any: any) => void;
}

const Upload = (props: IProps) => {

    const { selectedImage, setSelectedImage } = props;

    const fileInput = useRef<HTMLInputElement>(null);

    // This function will be triggered when the file field change
    const handleChange = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleClick = () => {
        if (fileInput.current) fileInput.current.click()
    }

    const uploadedImages = (
        selectedImage &&
            <Card role="button" aria-label="preview image" sx={{borderRadius: 4, aspectRatio: "1 / 1", cursor: "pointer", display: "flex", alignItems: "center"}} onClick={handleClick}>
                <Image                 
                    src={URL.createObjectURL(selectedImage)}
                    alt="Thumb"
                    objectFit="contain"
                    width={1000}
                    height={1000}
                    />
            </Card>
      
    )

    const uploadBG = (
        <Grid aria-label="upload widget" item container justifyContent={"center"} alignContent={"center"} onClick={handleClick}
            sx={{  aspectRatio: "1 / 1", cursor: "pointer", border: "0.2em dashed gray", borderRadius: 10 }}
            role="button">

            <Grid item container  justifyContent={"center"}>
                <FiUpload size={80} />
            </Grid>


            <Typography sx={{mt: 2}} variant="subtitle2">Click to Upload Image</Typography>

        {/* 
            <Typography sx={{mt: 2}} variant="subtitle2">Drag and Drop your Image here</Typography> */}

        </Grid>
    )

    return (
        <Box>
            <input aria-label={"upload input"}  accept="image/*" type="file" ref={fileInput}   style={{display: "none"}} onChange={handleChange}/>
            <Box style={{display: "flex",flexDirection: "column"}}>
                {   selectedImage ? uploadedImages : uploadBG   }
            </Box>
        </Box>
    );
};

export default memo(Upload);
