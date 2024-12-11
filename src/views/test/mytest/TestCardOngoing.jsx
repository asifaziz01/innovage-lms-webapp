// TestCardOngoing.js
import { Card, Typography, Grid, Box, Button } from '@mui/material'
import React from 'react'

const TestCardOngoing = ({ test, button }) => {
  // Function to format date to dd-mm-yyyy
  const formatDate = dateString => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // Month is zero-based
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const questionsData = [
    { icon: 'ri-file-list-line', title: 'Questions', subtitle: test.questions_count },
    { icon: 'ri-file-list-line', title: 'Marks', subtitle: '100' }, // Replace with actual data if available
    { icon: 'ri-file-list-line', title: 'Start Date', subtitle: formatDate(test?.enrolment?.start_date) },
    { icon: 'ri-file-list-line', title: 'End Date', subtitle: formatDate(test?.enrolment?.end_date) },
    { icon: 'ri-file-list-line', title: 'Duration', subtitle: '60 min' }, // Replace if actual duration exists
    { icon: 'ri-file-list-line', title: 'Instructor', subtitle: test.created_by }
  ]

  return (
    <Card
      sx={{
        width: '354px',
        height: '332px',
        padding: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        flexDirection: 'column'
      }}
    >
      <Typography variant='h6'>{test.title}</Typography>
      <Box sx={{ padding: 4 }} display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Grid container spacing={6} alignItems='stretch'>
          {questionsData.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              key={index}
              display='flex'
              flexDirection='row'
              justifyContent='left'
              gap={2}
              sx={{ alignItems: 'center' }}
            >
              <Box
                sx={{
                  height: '40px',
                  width: '40px',
                  background: '#666CFF29',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <i className={item.icon}></i>
              </Box>
              <Box>
                <Typography variant='h6' noWrap>
                  {item.title}
                </Typography>
                <Typography variant='body2' noWrap>
                  {item.subtitle}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {button}
    </Card>
  )
}

export default TestCardOngoing
