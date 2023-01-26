import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export type ALERT_TYPES = "error" | null;

interface IProps {
  type?: ALERT_TYPES;
  open: boolean;
  setOpen: (boolean: boolean) => void;
  message: string;
}

export default function Toast(props: IProps) {

  const { type, message, open, setOpen } = props

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar 
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open} 
        autoHideDuration={6000} 
        onClose={handleClose}>

        {
          type === "error" ? (        
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
              {message}
            </Alert>) :
          (
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              {message}
            </Alert>
          )
        }

    </Snackbar>
    );
}
