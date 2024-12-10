import React, { useState } from 'react'
import { Box, Card, Grid, Typography, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'

const ProgressCard = ({
  totalQuestions,
  currentQuestionIndex,
  selectedOptions,
  markForReview,
  setCollapseCard,
  collapseCard,
  onQuestionSelect
}) => {
  const [tabValue, setTabValue] = useState('2')

  // Define reusable box style
  const boxStyle = {
    width: '38px',
    height: '34px',
    border: '1px solid #7D808E',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
    color: '#7D808E',
    cursor: 'pointer'
  }

  // Tab change handler
  const handleChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Filter questions for "Not Attempted" (no option selected)
  const notAttemptedIndices = Array.from({ length: totalQuestions })
    .map((_, index) => index)
    .filter(index => selectedOptions?.[index] == null)
  // Render question boxes
  const renderQuestionBoxes = indices => (
    <Grid container spacing={2} paddingY={4}>
      {indices.map(index => {
        let bgColor = 'none' // Default

        if (selectedOptions?.[index] === 'reset') {
          bgColor = '#FF4D49' // Not Attempted
        } else if (markForReview?.[index]) {
          bgColor = '#FDC453' // Mark for Review
        } else if (selectedOptions?.[index]) {
          bgColor = '#72E128' // Answered
        }

        return (
          <Grid item xs={2.4} key={index}>
            <Box
              onClick={() => onQuestionSelect(index)}
              sx={{
                ...boxStyle,
                backgroundColor: bgColor,
                border: index === currentQuestionIndex ? '2px solid' : '1px solid',
                borderColor: index === currentQuestionIndex ? 'blue' : 'black',
                color: index === currentQuestionIndex ? 'white' : 'black'
              }}
            >
              <Typography>{index + 1}</Typography>
            </Box>
          </Grid>
        )
      })}
    </Grid>
  )

  // Calculate status counts for the bottom panel
  const answeredCount = Object.values(selectedOptions)?.filter(option => option && option !== 'reset')?.length
  const unattendedCount = Object.values(selectedOptions)?.filter(option => option === 'reset')?.length
  const reviewCount = Object.values(markForReview)?.filter(isMarked => isMarked)?.length
  const notVisitedCount = totalQuestions - Object.keys(selectedOptions)?.length

  return (
    <Box
      sx={{
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff'
      }}
    >
      {/* Header */}
      <Box sx={{ marginBottom: '40px' }}>
        <Typography
          variant='body1'
          marginBottom={6}
          style={{
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: 3
          }}
          onClick={() => setCollapseCard(!collapseCard)}
        >
          Click here to close this tab
        </Typography>

        <Grid container spacing={2} sx={{ marginTop: 1, marginBottom: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ ...boxStyle, backgroundColor: '#72E128' }}>
                <Typography>{answeredCount}</Typography>
              </Box>
              <Typography sx={{ marginLeft: 2 }}>Answered</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ ...boxStyle, backgroundColor: '#FF4D49' }}>
                <Typography>{unattendedCount}</Typography>
              </Box>
              <Typography sx={{ marginLeft: 2 }}>Unattended</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ ...boxStyle, backgroundColor: '#FDC453' }}>
                <Typography>{reviewCount}</Typography>
              </Box>
              <Typography sx={{ marginLeft: 2 }}>Review</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ ...boxStyle, backgroundColor: 'transparent' }}>
                <Typography>{notVisitedCount}</Typography>
              </Box>
              <Typography sx={{ marginLeft: 2 }}>Not Visited</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs for switching views */}
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 3 }}>
          <TabList onChange={handleChange} aria-label='Question Tabs'>
            <Tab label='All Questions' value='1' />
            <Tab label='Not Attempted' value='2' />
          </TabList>
        </Box>

        {/* Tab Panels */}
        <Box sx={{ minHeight: '85vh' }}>
          <TabPanel value='1'>
            {/* Show all questions */}
            {renderQuestionBoxes(Array.from({ length: totalQuestions }).map((_, index) => index))}
          </TabPanel>

          <TabPanel value='2'>
            {/* Show only not attempted questions */}
            {renderQuestionBoxes(notAttemptedIndices)}
          </TabPanel>
        </Box>
      </TabContext>

      {/* Status boxes at the bottom */}
    </Box>
  )
}

export default ProgressCard
