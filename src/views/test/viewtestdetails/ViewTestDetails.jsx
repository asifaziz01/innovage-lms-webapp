'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import FilterHeader from '@/Components/globals/FilterHeader'
import useViewSingleTestApi from '@/api/test/useViewSingleTestApi'
import { Card, Typography, Divider, Box, List, ListItem, Skeleton } from '@mui/material'

const ViewTestDetails = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const guid = searchParams.get('guid')

  useEffect(() => {
    if (guid) fetchTestDetails(guid)
  }, [guid])

  const { testDetails, loading, error, fetchTestDetails } = useViewSingleTestApi()
  return (
    <>
      <FilterHeader title='Test Details' />
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, padding: 20 }}>
          <Typography variant='h4'>{testDetails?.title}</Typography>
        </div>
        <Divider />
        <Card style={{ padding: 30, marginTop: 20, marginBottom: 30 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: '30px 0px', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant='h6'>All Questions: 21</Typography>
            </Box>
            <Divider orientation='vertical' flexItem sx={{ margin: '0 16px' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant='h6'>Negative Marking: -1</Typography>
            </Box>
            <Divider orientation='vertical' flexItem sx={{ margin: '0 16px' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant='h6'>Question Marks: 2 points</Typography>
            </Box>
            <Divider orientation='vertical' flexItem sx={{ margin: '0 16px' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant='h6'>Duration: 60 Min</Typography>
            </Box>
            <Divider orientation='vertical' flexItem sx={{ margin: '0 16px' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant='h6'>Test Type: MCQ</Typography>
            </Box>
          </Box>
          <Divider sx={{ marginBottom: 10 }} />
          <Box>
            <Typography variant='h5' gutterBottom>
              Instructions :
            </Typography>
            <Typography variant='subtitle1' gutterBottom>
              {testDetails?.details}
            </Typography>
            <Typography variant='h6' gutterBottom>
              Details :
            </Typography>
            <Typography variant='subtitle1' gutterBottom>
              {testDetails?.details}
            </Typography>
            <Typography variant='h6' gutterBottom>
              Instructor :
            </Typography>
            <Typography variant='subtitle1' gutterBottom>
              {testDetails?.created_by}
            </Typography>
          </Box>
        </Card>
      </div>
    </>
  )
}

export default ViewTestDetails
