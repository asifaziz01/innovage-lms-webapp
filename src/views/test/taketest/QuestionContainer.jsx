import React, { useState, useEffect } from 'react'

import { useSearchParams } from 'next/navigation'

import { Box, Grid, Typography } from '@mui/material'

import useTakeTestApi from '@/api/test/useTakeTestApi'
import QuestionCard from '../testcomponents/QuestionCard'
import QuestionHeader from '../testcomponents/QuestionHeader'
import QuestionFooter from '../testcomponents/QuestionFooter'
import ProgressCard from '../testcomponents/ProgressCard'
import useQuestionModuleApi from '@/api/useQuestionModuleApi'

const QuestionContainer = ({
  collapseCard,
  setCollapseCard,
  timeTaken,
  setTimeTaken,
  selectedOptions,
  setSelectedOptions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  markForReview,
  setMarkForReview,
  cameraStream
}) => {
  const [timeLeftPerQuestion, setTimeLeftPerQuestion] = useState({}) // Stores time left for each question
  const [timeLeft, setTimeLeft] = useState(null) // The current question's timer
  // const [timeTaken, setTimeTaken] = useState({}) // Stores time taken for each question

  const searchParams = useSearchParams()
  const guid = searchParams.get('guid')
  const { loading, error, fetchData, submitTest, testQuestions, fetchTestQuestions } = useTakeTestApi()

  useEffect(() => {
    if (guid) {
      fetchData(guid)
    }
  }, [guid])

  useEffect(() => {
    if (guid) {
      fetchTestQuestions(guid)
    }
  }, [guid])

  // Sorting All question from API payload & section

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

  console.log(questions, 'Result')

  const currentQuestion = questions ? questions?.[currentQuestionIndex] : null

  console.log(currentQuestionIndex)

  // Update timeLeft when currentQuestion changes
  useEffect(() => {
    if (currentQuestion) {
      const questionGuid = currentQuestion.guid

      // Get the saved timeLeft for this question or initialize it with fetched time
      const savedTimeLeft =
        timeLeftPerQuestion[questionGuid] !== undefined ? timeLeftPerQuestion[questionGuid] : currentQuestion.time

      setTimeLeft(savedTimeLeft)
    }
  }, [currentQuestionIndex, currentQuestion])

  // Handle the countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeLeft])

  // Save the time left for the current question when navigating away
  const saveTimeLeftForCurrentQuestion = () => {
    if (currentQuestion) {
      const questionGuid = currentQuestion.guid
      const initialQuestionTime = currentQuestion.time
      const timeTakenForQuestion = initialQuestionTime - timeLeft // Time taken is total time minus time left

      // Update timeTaken state for the current question
      setTimeTaken(prevTimeTaken => ({
        ...prevTimeTaken,
        [questionGuid]: timeTakenForQuestion
      }))

      // Save the remaining time for the current question
      setTimeLeftPerQuestion(prevState => ({
        ...prevState,
        [questionGuid]: timeLeft
      }))
    }

    console.log(timeTaken, 'time')
  }

  const handleNextQuestion = () => {
    saveTimeLeftForCurrentQuestion()
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1)
    }
  }

  // question nav

  const handlePreviousQuestion = () => {
    saveTimeLeftForCurrentQuestion()
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1)
    }
  }

  // option change

  const handleOptionChange = (questionIndex, option) => {
    setSelectedOptions(prev => ({ ...prev, [questionIndex]: option }))
  }

  //handle mark for review
  const handleMarkForReviewChange = (questionIndex, isMarked) => {
    setMarkForReview(prev => ({ ...prev, [questionIndex]: isMarked }))
  }

  //handle submit
  const handleSubmitTest = () => {
    if (guid && questions.length > 0) {
      submitTest(guid, selectedOptions, timeTaken)
    }
  }

  //handle question navigation
  const handleQuestionSelect = index => {
    saveTimeLeftForCurrentQuestion()
    setCurrentQuestionIndex(index)
  }

  if (loading) {
    return <div>Loading questions...</div>
  }

  if (error) {
    return <div>Error fetching questions: {error}</div>
  }

  // Lock the options if timeLeft is 0, but navigation is allowed
  const isLocked = timeLeft === 0

  return (
    <Grid container>
      <Grid container>
        <Grid
          item
          style={{
            width: '100%',
            transition: 'width 0.5s ease'
          }}
        >
          <Grid item xs={12}>
            {currentQuestion ? (
              <QuestionHeader
                sectionTitle={currentQuestion.section_title}
                cameraStream={cameraStream}
                timeLeft={timeLeft}
                currentQuestionNumber={currentQuestionIndex + 1}
                totalQuestions={questions?.length} // Safely access questions.length
                negativeMarking={currentQuestion?.neg_marks ?? 0}
                questionMarks={currentQuestion?.marks ?? 0}
              />
            ) : (
              <Typography variant='h6'>No question available</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            {currentQuestion ? (
              <QuestionCard
                sectionTitle={currentQuestion.section_title}
                totalQuestions={questions?.length}
                currentQuestionIndex={currentQuestionIndex}
                questionText={currentQuestion?.question ?? 'No question available'}
                description={currentQuestion?.feedback ?? 'No description available'}
                options={currentQuestion?.choices?.map(choice => choice?.choice) ?? []}
                selectedOption={selectedOptions?.[currentQuestionIndex] || ''}
                onOptionChange={option => handleOptionChange(currentQuestionIndex, option)}
                onMarkForReviewChange={isMarked => handleMarkForReviewChange(currentQuestionIndex, isMarked)}
                isLocked={isLocked}
              />
            ) : (
              <div>Loading question...</div>
            )}
          </Grid>
        </Grid>

        {/* <Grid
          item
          style={{
            width: collapseCard ? '22%' : '0%',
            overflow: 'hidden',
            transition: 'width 0.5s ease'
          }}
        >
          {collapseCard && questions && (
            <ProgressCard
              timeLeft={timeLeft}
              totalQuestions={questions.length}
              currentQuestionIndex={currentQuestionIndex}
              selectedOptions={selectedOptions}
              markForReview={markForReview}
              collapseCard={collapseCard}
              setCollapseCard={setCollapseCard}
              onQuestionSelect={handleQuestionSelect}
            />
          )}
        </Grid> */}
      </Grid>

      <Grid item xs={12} sx={{ mt: 2 }}>
        <QuestionFooter
          handleNext={handleNextQuestion}
          handlePrevious={handlePreviousQuestion}
          handleSubmit={handleSubmitTest}
          disablePrevious={currentQuestionIndex === 0}
          disableNext={currentQuestionIndex === (questions ? questions.length - 1 : -1)}
        />
      </Grid>
    </Grid>
  )
}

export default QuestionContainer
