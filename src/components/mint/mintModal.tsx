import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { IconButton, InputAdornment, Typography, TextField, Box, Alert, Button } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Close } from '@mui/icons-material';
import { Triangle } from 'react-loader-spinner';
import { LoadingButton } from '@mui/lab';



const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
  status: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  mint: any;
  tokenURI: string;
}

const state = ["Uploading Image...", "Uploading Metadata...", "Minting NFT..."]

export default function MintModal(props: IProps) {

  const { status, open, setOpen, mint, tokenURI } = props

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description">
        <DialogActions> <IconButton onClick={handleClose} ><Close /> </IconButton> </DialogActions>
        <DialogTitle>
          <Alert severity="info">Minting NFT please donot close this modal!</Alert>
        </DialogTitle>
        <DialogContent sx={{display: "flex", justifyContent: "center"}} >
          <DialogContentText sx={{display: "flex", alignItems: "center", flexDirection: "column"}}  id="alert-dialog-slide-description">

            {
              !(tokenURI && status === 1) ?
                <Triangle
                  height="80"
                  width="80"
                  color="#4fa94d"
                  ariaLabel="triangle-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              :
              <LoadingButton sx={{mt: 4}} variant='contained' onClick={mint?.write}> Mint Token </LoadingButton>
            }


            <Typography sx={{my: 4}}>{state[status]} {status + 1} / 3 </Typography>

          </DialogContentText>

        </DialogContent>
      </Dialog>
    </>
  );
}
