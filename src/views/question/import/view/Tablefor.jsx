import { useState, useEffect } from 'react'

import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Card from '@mui/material/Card'

const Tablefor = ({ handleExpandAll, handleCollapseAll, handleImportSelected }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  // Handler for opening the menu
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  // Handler for closing the menu
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Handler for "Import All"
  const handleImportAll = () => {
    setAnchorEl(null)

    // Add your logic for "Import All" here
  }

  // Handler for "Import Selected"
  // const handleImportSelected = () => {
  //   setAnchorEl(null)
  //   // Add your logic for "Import Selected" here
  //   console.log('Import Selected clicked')
  // }

  return (
    <Card>
      <CardContent style={{ paddingBottom: '5px', height: '80px' }}>
        <Grid container spacing={3} alignItems='center'>
          <Grid item xs={6} alignItems='center' style={{ display: 'flex' }}>
            <i className='ri-arrow-left-line' style={{ color: '#262B43E5' }} />
            <Typography style={{ fontWeight: '500', fontSize: '24px', color: '#262B43E5' }}>
              Import Wizard Step 2
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
            <Button style={{ color: '#007AFF', border: '1px solid #007AFF' }} onClick={handleExpandAll}>
              Expand All
            </Button>
            <Button style={{ color: '#007AFF', border: '1px solid #007AFF' }} onClick={handleCollapseAll}>
              Collapse All
            </Button>
            <Button
              variant='contained'
              startIcon={<i className='ri-download-2-line' style={{ color: 'white' }} />}
              onClick={handleClick} // Open the dropdown menu on button click
            >
              Import
            </Button>

            {/* Dropdown Menu for Import */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <MenuItem onClick={handleImportAll}>Import All</MenuItem>
              <MenuItem onClick={handleImportSelected}>Import Selected</MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Tablefor