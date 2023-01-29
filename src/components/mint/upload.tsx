/* eslint-disable @next/next/no-img-element */
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { useRef, useState } from "react";


interface IProps {
    setStage: (number: number) => void;
    selectedImage: any;
    setSelectedImage: (any: any) => void;
}

const Upload = (props: IProps) => {

  const { selectedImage, setSelectedImage, setStage } = props;
  const [loading, setLoading] = useState(false);


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

  const uploadImage = async () => {

    setLoading(true)

    const payload = { image: selectedImage }

    const config = {    
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }

    try {
        
        const res = await axios.post(`/api/upload-image`, payload, config)

        sessionStorage.setItem("image", res?.data?.IpfsHash)

        setStage(1)

    } catch (error) {

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
            }}>
        
        <input
          accept="image/*"
          type="file"
          ref={fileInput}
          style={{display: "none"}}
          onChange={handleChange}
        />

            <div 
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}>
                
                {
                    selectedImage ? (
                        <img   
                            onClick={handleClick}                      
                            src={URL.createObjectURL(selectedImage)}
                            style={{ maxWidth: "100%", maxHeight: 320, cursor: 'pointer' }}
                            alt="Thumb"
                            />
                    ) : (
                        <img     
                            onClick={handleClick}                   
                            src={"/upload.png"}
                            style={{ maxWidth: "100%", maxHeight: 320,  cursor: 'pointer'  }}
                            alt="Thumb"
                        />
                    )
                }

            </div>

            {
                selectedImage && (
                    <LoadingButton 
                        sx={{width: "100%", marginTop: "1em"}} 
                        variant={"contained"}
                        onClick={uploadImage}
                        loading={loading}
                        loadingIndicator={"Uploading..."}
                        > Upload 
                    </LoadingButton> )
            }

        </div>
    );
};

export default Upload;
