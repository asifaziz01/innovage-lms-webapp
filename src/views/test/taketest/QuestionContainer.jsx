import { Grid, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import QuestionCard from '../testcomponents/QuestionCard'
import QuestionHeader from '../testcomponents/QuestionHeader'
import QuestionFooter from '../testcomponents/QuestionFooter'
import useTakeTestApi from '@/api/useTakeTestApi'
import ProgressCard from '../testcomponents/ProgressCard'

const QuestionContainer = ({ collapseCard }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({}) // Track selected options
  const [markForReview, setMarkForReview] = useState({}) // Track "Mark for Review" state

  // Fetch questions using useTakeTestApi
  const { data: questions, error } = useTakeTestApi()
  const currentQuestion = questions ? questions[currentQuestionIndex] : null

  useEffect(() => {
    if (currentQuestion) {
      // Ensure timeLeft is a number
      const fetchedTime = currentQuestion.time
      setTimeLeft(fetchedTime !== null && fetchedTime !== undefined ? fetchedTime : 0)
    }
  }, [currentQuestionIndex, currentQuestion])

  // Handle timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1)
      }, 1000)

      return () => clearInterval(timer)
    } else if (timeLeft === 0) {
      handleNextQuestion() // Move to the next question when time is up
    }
  }, [timeLeft])

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1)
    }
  }

  const handleOptionChange = (questionIndex, option) => {
    // Update selected option
    setSelectedOptions(prev => ({ ...prev, [questionIndex]: option }))
  }

  const handleMarkForReviewChange = (questionIndex, isMarked) => {
    // Update mark for review state
    setMarkForReview(prev => ({ ...prev, [questionIndex]: isMarked }))
  }

  if (error) {
    return <div>Error fetching questions: {error.message}</div>
  }

  if (!questions) {
    return <div>Loading questions...</div>
  }

  return (
    <Grid container sx={{ padding: '16px' }}>
      <Grid container spacing={2}>
        <Grid item xs={collapseCard ? 9 : 12}>
          <Grid item xs={12}>
            {currentQuestion ? (
              <QuestionHeader
                timeLeft={timeLeft}
                currentQuestionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                negativeMarking={currentQuestion?.neg_marks ?? 0}
                questionMarks={currentQuestion?.marks ?? 0}
              />
            ) : (
              <div>
                <Typography variant='h6'>Loading..</Typography>
              </div>
            )}
          </Grid>
          {/* Question Card*/}

          <Grid item xs={12} sx={{ mt: 2 }}>
            {currentQuestion ? (
              <QuestionCard
                questionText={currentQuestion?.question ?? 'No question available'}
                description={currentQuestion?.feedback ?? 'No description available'}
                options={currentQuestion?.choices?.map(choice => choice.choice) ?? []}
                selectedOption={selectedOptions[currentQuestionIndex] || ''}
                onOptionChange={option => handleOptionChange(currentQuestionIndex, option)}
                onMarkForReviewChange={isMarked => handleMarkForReviewChange(currentQuestionIndex, isMarked)}
              />
            ) : (
              <div>Loading question...</div>
            )}
          </Grid>
        </Grid>

        {/* Test Progress Card */}
        {collapseCard && (
          <Grid item xs={3}>
            <ProgressCard
              totalQuestions={questions.length}
              currentQuestionIndex={currentQuestionIndex}
              selectedOptions={selectedOptions} // Pass selected options
              markForReview={markForReview} // Pass mark for review state
            />
          </Grid>
        )}
      </Grid>

      {/* Question Footer */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <QuestionFooter
          handleNext={handleNextQuestion}
          handlePrevious={handlePreviousQuestion}
          disablePrevious={currentQuestionIndex === 0}
          disableNext={currentQuestionIndex === questions.length - 1}
        />
      </Grid>
    </Grid>
  )
}

export default QuestionContainer
