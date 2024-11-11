'use client'
import React, { useEffect, useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'

import { Box, Card, CardContent, FormControlLabel, Grid, IconButton, Radio, Tab, Typography } from '@mui/material'

import Select from '@mui/material/Select'

import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

import CustomTabList from '@core/components/mui/TabList'

import useTestApi from '@/api/test/useTestApi'
import FilterHeader from '@/components/globals/FilterHeader'
import DifficultyListTable from './difficulty/DifficultiesListTable'
import DifficultiesList from './difficulty/DifficultiesList'

// API import

const QuestionBankSettings = ({ isLoading = false }) => {
  const [types, setTypes] = useState(null)
  const [activeTab, setActiveTab] = useState('importance') // Ensure activeTab is initialized properly
  const searchParams = useSearchParams()
  const guid = searchParams.get('guid')
  const router = useRouter()

  //   const [data, setData] = useState(null)

  // useForm hook
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm()

  const { data, testData, viewTest, updateTestData, categories, getCategories, testSettings } = useTestApi()

  // Fetch data and populate form on component mount
  useEffect(() => {
    if (guid) {
      viewTest(guid).then(res => {
        setTypes(String(res?.data?.payload?.type))
        reset({
          title: res?.data?.payload?.title,
          type: res?.data?.payload?.type,
          details: res?.data?.payload?.details
        })
      })
    }
  }, [guid, reset])

  useEffect(() => {
    getCategories()
  }, [])

  // Function to handle tab change
  const handleChange = (event, newValue) => {
    setActiveTab(newValue) // Update activeTab when a tab is clicked
  }

  const handleFormSubmit = async data => {
    updateTestData(guid, { ...data, type: types })
  }

  return (
    <>
      <FilterHeader title='Question Bank Settings' subtitle='Mathematics Test' />
      <Grid container xs={12}>
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <CustomTabList value={activeTab} onChange={handleChange} variant='scrollable' pill='true'>
              <Tab
                label={
                  <div className='flex items-center gap-2'>
                    <i class='ri-lock-2-line' />
                    Importance
                  </div>
                }
                value='importance'
              />
              <Tab
                label={
                  <div className='flex items-center gap-2'>
                    <i class='ri-bookmark-line' />
                    Difficulty
                  </div>
                }
                value='difficulty'
              />
            </CustomTabList>
            <Grid item xs={12}>
              {/* TabPanels to render content for each tab */}

              <TabPanel value='importance' sx={{ marginTop: 10 }}>
                {/* <QuestionGeneralSettings testSettings={testSettings} guid={guid} setFormState={setFormState} /> */}
              </TabPanel>
              <TabPanel value='difficulty' sx={{ marginTop: 10 }}>
                <DifficultiesList />
              </TabPanel>
            </Grid>
          </TabContext>
        </Grid>
      </Grid>
    </>
  )
}

export default QuestionBankSettings
