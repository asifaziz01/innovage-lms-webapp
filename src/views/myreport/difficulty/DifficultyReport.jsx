'use client'
import { Box, Typography } from '@mui/material'

const DifficultyReport = () => {
  return (
    <Box display='flex' flexDirection='column' alignItems='space-between' justifyContent='center'>
      <Typography pr={10} fontWeight='bold' fontSize={15}>
        Total
      </Typography>
      <Box display='flex' alignItems='flex-start' flexGrow={1} gap={3} py={4} flexWrap='wrap'>
        <Box
          display='flex'
          flexGrow={1}
          sx={{
            border: theme => `1px solid ${theme.palette.customColors.lightgrey}`,
            borderRadius: 1
          }}
          p={4}
        >
          <i className='ri-circle-fill' style={{ color: '#FDB528' }}></i>
          <Box display='flex' flexDirection='column'>
            <Typography>Medium</Typography>
            <Typography fontWeight='bold' fontSize={18}>
              40
            </Typography>
          </Box>
        </Box>
        <Box
          display='flex'
          flexGrow={1}
          sx={{
            border: theme => `1px solid ${theme.palette.customColors.lightgrey}`,
            borderRadius: 1
          }}
          p={4}
        >
          <i className='ri-circle-fill' style={{ color: '#FF4D49' }}></i>
          <Box display='flex' flexDirection='column'>
            <Typography>High</Typography>
            <Typography fontWeight='bold' fontSize={18}>
              30
            </Typography>
          </Box>
        </Box>
        <Box
          display='flex'
          flexGrow={1}
          sx={{
            border: theme => `1px solid ${theme.palette.customColors.lightgrey}`,
            borderRadius: 1
          }}
          p={4}
        >
          <i className='ri-circle-fill' style={{ color: '#72E128' }}></i>
          <Box display='flex' flexDirection='column'>
            <Typography>Easy</Typography>
            <Typography fontWeight='bold' fontSize={18}>
              20
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default DifficultyReport
