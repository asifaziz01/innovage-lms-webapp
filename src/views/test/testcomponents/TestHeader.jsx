import React from 'react'
import useTakeTestApi from '@/api/test/useTakeTestApi'
import { AppBar, Toolbar, IconButton, Typography, Button, Box, Chip } from '@mui/material'
import CustomIconButton from '@/@core/components/mui/IconButton'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'

const TestHeader = ({
  title,
  subtitle,
  timeLeft,
  buttons,
  setCollapseCard,
  collapseCard,
  test_guid,
  question_guid
}) => {
  const { bookmarkQuestion } = useTakeTestApi()
  const handleBookmark = () => {
    bookmarkQuestion(test_guid, question_guid)
  }

  // Format time as hh:mm:ss
  const formatTime = seconds => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            padding: '8px',
            height: 32,
            borderRadius: 1,
            bgcolor: '#FFDBDB',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {hrs?.toString()?.padStart(2, '0')}
        </Box>
        :
        <Box
          sx={{
            padding: '8px',
            height: 32,
            borderRadius: 1,
            bgcolor: '#FFDBDB',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {mins?.toString()?.padStart(2, '0')}
        </Box>
        :
        <Box
          sx={{
            padding: '8px',
            height: 32,
            borderRadius: 1,
            bgcolor: '#FFDBDB',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {secs?.toString()?.padStart(2, '0')}
        </Box>
      </Box>
    )
  }

  // custom tool tip

  const CustomBox = () => {
    return (
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: '#f9f9f9',
          maxWidth: '400px'
        }}
      >
        {/* Title */}
        <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Title
        </Typography>

        <Typography variant='subtitle1' sx={{ marginBottom: '16px', color: 'gray' }}>
          {subtitle}
        </Typography>

        {/* Details List */}
        <Grid container spacing={2}>
          {details.map((item, index) => (
            <React.Fragment key={index}>
              <Grid item xs={6}>
                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                  {item.label}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant='body2'>{item.value}</Typography>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    )
  }

  const longText = `${title} ` + 'Test Duration: 1h' + 'Total Marks: 100'

  return (
    <AppBar position='static' component='nav' sx={{ backgroundColor: '#F5F5F7', boxShadow: 'none', border: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignContent: 'center', height: '60px' }}>
        {/* Left section with title and subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '30px' }}>
          <Typography variant='h5' component='div'>
            {title}
          </Typography>
          {/* <Typography variant='body2' component='div'>
            {subtitle}
          </Typography> */}
        </div>

        {/* Right section with timer and buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          <Tooltip title={longText} arrow>
            <CustomIconButton>
              <i className='ri-information-line'></i>
            </CustomIconButton>
          </Tooltip>
          {/* <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Tooltip title='Bookmark Question' arrow>
              <IconButton onClick={handleBookmark}>
                <i class='ri-bookmark-line' />
              </IconButton>
            </Tooltip>
          </Box> */}
          {timeLeft > 0 && (
            <>
              <Typography variant='h6' component='div'>
                Test Timer:
              </Typography>
              <Typography variant='body1' component='div' sx={{ marginRight: '16px' }}>
                {formatTime(timeLeft)} {/* Display formatted time */}
              </Typography>
            </>
          )}
          {buttons} {/* Render the buttons passed as prop */}
          <IconButton
            size='large'
            edge='start'
            aria-label='menu'
            sx={{ mr: 3 }}
            onClick={() => setCollapseCard(!collapseCard)}
          >
            <i className='ri-menu-fill' />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default TestHeader
