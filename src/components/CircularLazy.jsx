import React from 'react'
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';

function CircularLazy() {
    return (
        <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress size={32} color="primary" />
        </Typography>
    )
}

export default React.memo(CircularLazy)