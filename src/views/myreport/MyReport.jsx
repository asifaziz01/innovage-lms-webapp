'use client'
import React, { useState, useEffect } from 'react'
import { Card, Grid, Typography, Box, ToggleButton, ToggleButtonGroup, Button } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import CustomTabList from '@/@core/components/mui/TabList'
import FilterHeader from '@/components/globals/FilterHeader'
import MyReportSummary from './MyReportSummary'
import MyReportDetails from './MyReportDetails'
import MyReportDifficulty from './MyReportDifficulty'
const MyReport = () => {
  const [value, setValue] = useState('1')
  return (
    <>
      <FilterHeader title='My Report'></FilterHeader>
      <TabContext value={value}>
        <CustomTabList pill='true' onChange={(e, newValue) => setValue(newValue)} aria-label='test tabs'>
          <Tab value='1' label='Summary' />
          <Tab value='2' label='Details' />
          <Tab value='3' label='Difficulty' />
          <Tab value='4' label='Statistics' />
        </CustomTabList>

        <Card sx={{ padding: 4, marginTop: 6 }}>
          <TabPanel value='1'>
            <MyReportSummary />
          </TabPanel>
          <TabPanel value='2'>
            <MyReportDetails />
          </TabPanel>
          <TabPanel value='3'>
            <MyReportDifficulty />
          </TabPanel>
          <TabPanel value='4'></TabPanel>
        </Card>
      </TabContext>
    </>
  )
}

export default MyReport
