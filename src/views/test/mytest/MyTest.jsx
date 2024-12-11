'use client'
import React, { useState, useEffect } from 'react'
import { Card, Grid, Typography, Box, ToggleButton, ToggleButtonGroup, Button } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import FilterHeader from '@/Components/globals/FilterHeader'
import MyTestFilter from './MyTestFilter'
import TestCardOngoing from './TestCardOngoing'
import TestTableOngoing from './TestTableOngoing'
import useMyTestApi from '@/api/useMyTestApi'
import { useRouter } from 'next/navigation'
import CustomTabList from '@/@core/components/mui/TabList'

const MyTest = () => {
  const [value, setValue] = useState('1') // Active tab state
  const [isGridView, setIsGridView] = useState(true) // Grid vs Table view toggle
  const [filter, setFilter] = useState({ search: '', resultPerPage: 10, page: 1, type: 'ongoing' })
  const [cachedData, setCachedData] = useState({ ongoing: [], upcoming: [], previous: [] }) // Cache for each tab
  const { data, loading, error } = useMyTestApi(filter)
  const router = useRouter()

  const handleFilterChange = updatedFilter => {
    setFilter(prev => ({ ...prev, ...updatedFilter }))
  }
  useEffect(() => {
    if (!loading && data.length) {
      setCachedData(prev => ({
        ...prev,
        [filter.type]: data // Cache the data for the specific type
      }))
    }
  }, [loading, data, filter.type])

  const currentData = loading ? cachedData[filter.type] || [] : data

  const handleTabChange = (event, newValue) => {
    setValue(newValue)
    setFilter(prev => ({
      ...prev,
      type: newValue === '1' ? 'ongoing' : newValue === '2' ? 'upcoming' : 'previous'
    }))
  }

  const startTestButton = guid => (
    <Button
      sx={{ height: '38px', maxWidth: '314px' }}
      variant='contained'
      color='primary'
      onClick={() => router.push(`/instructions/generalinstructions?guid=${guid}`)}
    >
      Start Test
    </Button>
  )

  const viewDetailsButton = guid => (
    <Button
      sx={{ height: '38px', maxWidth: '314px' }}
      variant='contained'
      color='primary'
      onClick={() => router.push(`/test/viewtestdetails?guid=${guid}`)}
    >
      View Details
    </Button>
  )

  const viewReportButton = (
    <Button
      sx={{ height: '38px', maxWidth: '314px' }}
      variant='contained'
      color='primary'
      onClick={() => router.push('/myreport')}
    >
      View Report
    </Button>
  )

  return (
    <div>
      <FilterHeader title='My Test' />

      <TabContext value={value}>
        <CustomTabList pill='true' onChange={handleTabChange} aria-label='test tabs'>
          <Tab value='1' label='Ongoing' />
          <Tab value='2' label='Upcoming' />
          <Tab value='3' label='Previous' />
        </CustomTabList>

        <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', padding: 4 }}>
          <ToggleButtonGroup
            value={isGridView ? 'grid' : 'table'}
            exclusive
            onChange={(e, newView) => setIsGridView(newView === 'grid')}
            aria-label='view toggle'
            color='primary'
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
          <MyTestFilter onFilterChange={handleFilterChange} />
          <Grid container item xs={12} paddingTop={8}>
            {loading && <Typography>Loading...</Typography>}
            {error && <Typography>Error: {error.message}</Typography>}

            {['1', '2', '3'].map(tab => (
              <TabPanel key={tab} value={tab} hidden={value !== tab} sx={{ width: '100%' }}>
                {currentData.length === 0 ? (
                  <Typography>No tests available.</Typography>
                ) : isGridView ? (
                  <Grid container spacing={4}>
                    {currentData.map((test, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <TestCardOngoing
                          test={test}
                          button={
                            tab === '1' ? (
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: 2,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginBottom: 4
                                }}
                              >
                                {viewDetailsButton(test.guid)}
                                {startTestButton(test.guid)}
                              </Box>
                            ) : tab === '2' ? (
                              viewDetailsButton(test.guid)
                            ) : (
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: 2,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginBottom: 4
                                }}
                              >
                                {viewDetailsButton(test.guid)}
                                {viewReportButton}
                              </Box>
                            )
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <TestTableOngoing data={currentData} type={filter.type} />
                )}
              </TabPanel>
            ))}
          </Grid>
        </Card>
      </TabContext>
    </div>
  )
}

export default MyTest
