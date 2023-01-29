import * as React from 'react';
import { Menu, MenuItem, Paper, InputBase, IconButton, CircularProgress, Grid, Divider, Typography, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from "./../../styles/Nav.module.css";
import axios from 'axios';
import { useRouter } from 'next/router';
import { verifyAddress } from '../../libs/utils';
import { toast } from 'react-toastify';
import { searchCollection } from '../../libs/alchemy';

interface IProps {
    show?: boolean;
    close?: () => void; 
}

export default function Search(props: IProps) {

    const router = useRouter()

    const [collectionAddress, setcollectionAddress] = React.useState('')
    
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const [result, setResult] = React.useState<any>(null);

    const [disabled, setDisabled] = React.useState(true);

    const [loading, setLoading] = React.useState(false);

    const ref = React.useRef(null)

    const open = Boolean(anchorEl);
      
    const handleClose = () => {
        setAnchorEl(null);
    };

    const search = async () => {
        setResult(null)
        setAnchorEl(ref.current)
        setLoading(true)

        const result =  await searchCollection(collectionAddress)

        if (result.status)
            setResult(result.data)
        else {
            toast.error(result.error)
            setAnchorEl(null)
        }

        setLoading(false)

    }

    React.useEffect(() => {
        if (verifyAddress(collectionAddress)) setDisabled(false)
        else setDisabled(true)
    }, [collectionAddress])


    return (
        <Box width={"100%"}>

            {
                props?.show && (
                    <Box 
                        aria-label={"invisible"} 
                        onClick={props?.close} className={styles.search_bg}>
                    </Box>
                )
            }

            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
                className={styles.search}
                >

                <Grid item container>

                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search Collection address"
                        inputProps={{ 'aria-label': 'Search Collection address' }}
                        onChange={(e) => setcollectionAddress(e.target.value)}
                        autoFocus={props.show ? true: false}
                    />

                    <IconButton disabled={disabled} onClick={search} type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon  />
                    </IconButton>

                    <Menu
                        aria-label='Search Results'
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        sx={{marginTop: '2em'}}
                        MenuListProps={{'aria-labelledby': 'basic-button'}}>

                        <Typography variant='h6' sx={{p: 1}}> Collections </Typography>

                        <Divider />

                        <MenuItem sx={{width: 390}}> 

                            {
                                loading && (
                                    <Grid item justifyContent={"center"} container>
                                        <CircularProgress  disableShrink />
                                    </Grid>
                                )
                            }

                            {

                                result && (
                                    <Grid item container onClick={() => {
                                        setAnchorEl(null)
                                        router.push(`/collection/${collectionAddress}`)
                                    }}>
                                        <Grid item xs={12}>  <Typography variant='h6'> {    result.name }   </Typography> </Grid>   
                                        <Grid item xs={12}>  <Typography variant='subtitle2'> Total Supply: {    result.totalSupply  }</Typography> </Grid>   
                                    </Grid>
                                )
                                
                            }
                                
                        </MenuItem>

                    </Menu>

                    <Grid item container>
                        <div ref={ref}></div>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}

