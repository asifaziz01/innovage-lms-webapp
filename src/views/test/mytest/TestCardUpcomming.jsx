import { Card, Typography, Grid, CardHeader, Box, Button } from '@mui/material'
import React from 'react'

const questionsData = [
  { icon: 'ri-file-list-line', title: 'Questions', subtitle: '25' },
  { icon: 'ri-file-list-line', title: 'Marks', subtitle: '100' },
  { icon: 'ri-file-list-line', title: 'Start Date', subtitle: '10-10-24' },
  { icon: 'ri-file-list-line', title: 'End Date', subtitle: '10-10-24' },
  { icon: 'ri-file-list-line', title: 'Duration', subtitle: '60 min' },
  { icon: 'ri-file-list-line', title: 'Instructor', subtitle: 'john' }
]

const TestCardUpcomming = () => {
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
      <Typography variant='h6'>Indian Politics All Test</Typography>
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
      <Button sx={{ height: '38px', width: '314px' }} variant='contained' color='primary'>
        View Details
      </Button>
    </Card>
  )
}

export default TestCardUpcomming
