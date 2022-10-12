import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Close } from '@mui/icons-material';
import Upload from './Upload';
import Description from './Description';
import styles from '../../../styles/Home.module.css'
import Mint from './Mint';
import Success from './Success';



const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
  open: boolean; 
  setOpen: (value: boolean) => void;
}

export default function Modal(props: IProps) {

  const { open, setOpen } = props
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [stage, setStage] = React.useState(0)
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")


  const handleClose = () => {
    setOpen(false);
    setStage(0)
    setSelectedImage(null)
    setName("")
    setDescription("")
  };

  return (
    <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        >

        <DialogActions>
          <Button onClick={handleClose}> <Close /> </Button>
        </DialogActions>

        <DialogTitle sx={{color: "#000"}}>{ stage === 0 && "Upload Image" } { stage === 1 && "Description" }</DialogTitle>

        <DialogContent className={styles.modal}>

            <DialogContentText id="alert-dialog-slide-description">

              { stage === 0 && <Upload setStage={setStage} selectedImage={selectedImage} setSelectedImage={setSelectedImage} /> }

              { stage === 1 && <Description 
                setStage={setStage} 
                name={name} 
                description={description} 
                setName={setName} 
                setDescription={setDescription} /> }

              { stage === 2 && <Mint setStage={setStage} selectedImage={selectedImage} /> }

              { stage === 3 && <Success setStage={setStage} handleClose={handleClose} /> }
                
            </DialogContentText>

        </DialogContent>

    </Dialog>
    )
}
