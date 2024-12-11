'use client'

import React, { useState, useEffect } from 'react'
import { Card, Typography, Grid, Button, Box, ToggleButton, ToggleButtonGroup } from '@mui/material'
import useBrowseAllTestApi from '@/api/test/useBrowseAllTestApi'
import BrowseTestCard from './BrowseTestCard'
import BrowseTestTable from './BrowseTestTable'
import { useRouter } from 'next/navigation'

const BrowseAllTest = () => {
  const [isGridView, setIsGridView] = useState(true) // Toggle between grid and table view
  const { allTestData, loading, error, fetchAllTestData } = useBrowseAllTestApi()
  const router = useRouter()

  const handleEnroll = testId => {
    console.log(`Enrolling to test ${testId}`)
    // Add enrollment logic here
  }

  const handleViewDetails = testId => {
    router.push(`/test/viewtestdetails?guid=${testId}`)
  }

  useEffect(() => {
    fetchAllTestData()
  }, [])

  const currentData = allTestData ? allTestData?.data || [] : []

  const buttonRenderer = test => (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button variant='contained' color='primary' onClick={() => handleEnroll(test.guid)}>
        Enroll
      </Button>
      <Button variant='outlined' onClick={() => handleViewDetails(test.guid)}>
        View Details
      </Button>
    </Box>
  )

  return (
    <div>
      <Typography variant='h4' gutterBottom>
        Browse All Tests
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', marginBottom: 4 }}>
        <ToggleButtonGroup
          value={isGridView ? 'grid' : 'table'}
          exclusive
          onChange={(e, newView) => setIsGridView(newView === 'grid')}
          aria-label='view toggle'
        >
          <ToggleButton value='table' aria-label='table view' size='small'>
            <i className='ri-table-line'></i>
          </ToggleButton>
          <ToggleButton value='grid' aria-label='grid view' size='small'>
            <i className='ri-layout-grid-line'></i>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Card sx={{ padding: 4 }}>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography>Error: {error.message}</Typography>}
        {!loading && currentData.length === 0 && <Typography>No tests available.</Typography>}
        {!loading &&
          currentData?.length > 0 &&
          (isGridView ? (
            <Grid container spacing={4}>
              {currentData.map((test, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <BrowseTestCard test={test} button={buttonRenderer(test)} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <BrowseTestTable data={currentData} buttonRenderer={buttonRenderer} />
          ))}
      </Card>
    </div>
  )
}

export default BrowseAllTest
