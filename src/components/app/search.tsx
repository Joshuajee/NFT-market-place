import * as React from 'react';
import { Menu, MenuItem, Paper, InputBase, IconButton, CircularProgress, Grid, Divider, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from "./../../styles/Nav.module.css";
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Search() {

    const router = useRouter()

    const [contractAddress, setContractAddress] = React.useState('')
    
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const [result, setResult] = React.useState<any>(null);

    const [loading, setLoading] = React.useState(false);

    const ref = React.useRef(null)

    const open = Boolean(anchorEl);
      
    const handleClose = () => {
        setAnchorEl(null);
    };

    const search = async () => {

        setAnchorEl(ref.current)

        setLoading(true)

        try {

            const res = await axios.get(`/api/search?contractAddress=${contractAddress}`)

            setResult(res?.data?.data)

        } catch (e) {
            console.error(e)
        }

        setLoading(false)

    }


    return (
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
                    onChange={(e) => setContractAddress(e.target.value)}
                />

                <IconButton onClick={search} type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon  />
                </IconButton>

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    sx={{marginTop: '2em'}}
                    MenuListProps={{'aria-labelledby': 'basic-button'}}>

                    <MenuItem sx={{width: 390}}> Collections </MenuItem>

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
                                    router.push(`/collection?contract=${contractAddress}`)
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
    );
}

