'use client'
import React, { useState } from 'react'
import FilterHeader from '@/components/globals/FilterHeader'
import { Box, Card, Chip, Divider, Menu, MenuItem, Typography, Button } from '@mui/material'
import MySubmissionsFilter from './MySubmissionsFilter'

const MySubmissions = () => {
  const detailsStructure = [
    { icon: 'ri-calendar-line', title: 'Attempt Date' },
    { icon: 'ri-upload-line', title: 'Submission Date' },
    { icon: 'ri-time-line', title: 'Time Taken' },
    { icon: 'ri-star-line', title: 'Marks' }
  ]

  const testData = [
    {
      title: 'Test 1',
      status: 'Completed',
      data: ['12/12/24', '12/12/24', '60 min', '100']
    },
    {
      title: 'Test 2',
      status: 'In Progress',
      data: ['14/12/24', '12/12/24', '30 min', '100']
    },
    {
      title: 'Test 2',
      status: 'In Progress',
      data: ['14/12/24', '12/12/24', '30 min', '100']
    },
    {
      title: 'Test 2',
      status: 'In Progress',
      data: ['14/12/24', '12/12/24', '30 min', '100']
    }
  ]

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTest, setSelectedTest] = useState(null)

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget)
    setSelectedTest(index)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedTest(null)
  }

  return (
    <>
      <FilterHeader title='My Submissions' />

      <Card>
        <MySubmissionsFilter />

        <Box sx={{ padding: 4 }}>
          {testData.map((test, index) => (
            <React.Fragment key={index}>
              {/* Test Title and Status */}
              <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                <Typography variant='h6'>{test.title}</Typography>
                <Box display='flex' alignItems='center' gap={2}>
                  <Chip size='small' label={test.status} color={test.status === 'Completed' ? 'success' : 'warning'} />
                  <Button size='small' variant='contained' onClick={event => handleMenuOpen(event, index)}>
                    Report
                  </Button>
                </Box>
              </Box>

              {/* Test Data */}
              <Box display='flex' flexWrap='wrap' gap={4}>
                {detailsStructure.map((detail, i) => (
                  <Box
                    key={i}
                    display='flex'
                    flexDirection='row'
                    gap={2}
                    sx={{
                      alignItems: 'center',

                      padding: 2,
                      borderRadius: 2
                    }}
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
                      <i className={detail.icon}></i>
                    </Box>
                    <Box>
                      <Typography variant='h6' noWrap>
                        {detail.title}
                      </Typography>
                      <Typography variant='body2' noWrap>
                        {test.data[i]}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Divider */}
              {index < testData.length - 1 && <Divider sx={{ my: 2 }} />}
            </React.Fragment>
          ))}
        </Box>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: { width: 200 }
          }}
        >
          <MenuItem onClick={handleMenuClose}>Summary</MenuItem>
          <MenuItem onClick={handleMenuClose}>Details</MenuItem>
          <MenuItem onClick={handleMenuClose}>Difficulty</MenuItem>
          <MenuItem onClick={handleMenuClose}>Report</MenuItem>
        </Menu>
      </Card>
    </>
  )
}

export default MySubmissions
