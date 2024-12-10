'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material'
import Header from '@/@layouts/components/horizontal/Header'
import QuestionContainer from './QuestionContainer'
import TestHeader from '../testcomponents/TestHeader'
import useTakeTestApi from '@/api/test/useTakeTestApi'
import UserDetails from '../testcomponents/UserDetails'
import ProgressCard from '../testcomponents/ProgressCard'

const TakeTest = ({ mediaAccessGranted, onSubmit }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [collapseCard, setCollapseCard] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const guid = searchParams.get('guid')

  // Fetch test data
  const { test, loading, error, testQuestions, fetchTestQuestions, submitTest, fetchData, fetchTestData } =
    useTakeTestApi()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [markForReview, setMarkForReview] = useState({})
  const [selectedOptions, setSelectedOptions] = useState({})
  const [timeTaken, setTimeTaken] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    if (guid) fetchData(guid)
  }, [guid])

  useEffect(() => {
    if (guid) fetchTestData(guid)
  }, [guid])

  useEffect(() => {
    if (guid) fetchTestQuestions(guid)
  }, [guid])

  useEffect(() => {
    if (testQuestions?.data?.test_duration) {
      const duration = parseInt(test.settings.test_duration, 10)
      setTimeLeft(duration > 0 ? duration * 60 : null)
    }
  }, [test])

  // Fetch camera stream when media access is granted
  useEffect(() => {
    if (mediaAccessGranted) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => setCameraStream(stream))
        .catch(err => console.error('Camera access denied:', err))
    }

    return () => {
      // Stop camera stream on unmount
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [mediaAccessGranted])

  const handleDialogClose = () => setOpenDialog(false)

  const handleDialogOpen = () => setOpenDialog(true)

  const handleSubmitTest = () => {
    if (questions.length > 0) {
      submitTest(guid, selectedOptions, timeTaken)
    }
    onSubmit()
    router.push('/feedbackform')
  }

  const questions = testQuestions?.data?.questions?.flatMap(item => {
    if (item?.type === 'section') {
      return item?.children.map(child => ({
        ...child,
        section_title: item?.question // Add section title to each child
      }))
    } else {
      return item // Keep non-section items as is
    }
  })

  const totalQuestions = questions?.length || 0
  const answeredCount = Object.values(selectedOptions).filter(option => option && option !== 'reset').length
  const notVisitedCount = totalQuestions - Object.keys(selectedOptions).length

  return (
    <Grid container>
      {/* Main Test Area */}
      <Grid
        item
        xs={collapseCard ? 12 : 9} // Adjust width dynamically based on collapseCard state
        style={{
          transition: 'width 0.3s ease' // Smooth transition for width changes
        }}
      >
        <Header>
          <TestHeader
            title={testQuestions?.data?.title}
            subtitle={test?.title}
            timeLeft={timeLeft}
            setCollapseCard={setCollapseCard}
            collapseCard={collapseCard}
            buttons={
              <Button variant='contained' color='primary' onClick={handleDialogOpen}>
                Submit Test
              </Button>
            }
          />
        </Header>

        <QuestionContainer
          cameraStream={cameraStream}
          currentQuestionIndex={currentQuestionIndex}
          setMarkForReview={setMarkForReview}
          markForReview={markForReview}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          timeTaken={timeTaken}
          setTimeTaken={setTimeTaken}
          questions={questions}
          loading={loading}
          error={error}
        />
      </Grid>

      {/* Side Panel */}
      <Grid
        item
        xs={collapseCard ? 0 : 3} // Collapse ProgressCard, but keep UserDetails visible
        style={{
          display: collapseCard ? 'none' : 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          transition: 'width 0.3s ease'
        }}
      >
        {/* UserDetails remains visible */}
        {/* <UserDetails cameraStream={cameraStream} /> */}

        {/* Conditionally render ProgressCard */}
        {!collapseCard && (
          <ProgressCard
            setCollapseCard={setCollapseCard}
            collapseCard={collapseCard}
            totalQuestions={totalQuestions}
            currentQuestionIndex={currentQuestionIndex}
            selectedOptions={selectedOptions}
            markForReview={markForReview}
            onQuestionSelect={setCurrentQuestionIndex}
          />
        )}
      </Grid>

      {/* Submit Test Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Are you sure you want to submit the test?</DialogTitle>
        <DialogContent>
          <Box display='flex' justifyContent='space-around' mb={2}>
            <Box display='flex' alignItems='center'>
              <Box p={1} bgcolor='#b3e5fc' borderRadius='8px' mx={1}>
                {answeredCount}
              </Box>
              Attempted
            </Box>
            <Box display='flex' alignItems='center'>
              <Box p={1} bgcolor='#ffcdd2' borderRadius='8px' mx={1}>
                {notVisitedCount}
              </Box>
              Not Attempted
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant='outlined' color='secondary'>
            No
          </Button>
          <Button onClick={handleSubmitTest} variant='contained' color='primary'>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default TakeTest
