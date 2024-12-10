import React from 'react'

import {
  Card,
  CardContent,
  Divider,
  Typography,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox
} from '@mui/material'

const decodeHtmlEntities = text => {
  const parser = new DOMParser()
  const parsedString = parser.parseFromString(text, 'text/html').body.textContent
  return parsedString
}

const QuestionCard = ({
  questionText,
  description,
  options,
  selectedOption,
  onOptionChange,
  onMarkForReviewChange,
  totalQuestions,
  currentQuestionIndex,
  isLocked,
  sectionTitle
}) => {
  const handleOptionChange = event => {
    if (!isLocked) {
      onOptionChange(event.target.value)
    }
  }

  const handleResetChoices = () => {
    if (!isLocked) {
      onOptionChange('reset') // Allow resetting the selection
    }
  }

  const handleMarkForReviewChange = event => {
    if (!isLocked) {
      onMarkForReviewChange(event.target.checked)
    }
  }

  return (
    <Card sx={{ minHeight: '100vh', boxShadow: 'none', border: 'none' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant='body2'>
          {currentQuestionIndex + 1} of {totalQuestions}
        </Typography>

        <Typography
          variant='h6'
          dangerouslySetInnerHTML={{
            __html: decodeHtmlEntities(questionText)
          }}
        />

        <Typography
          variant='body1'
          dangerouslySetInnerHTML={{
            __html: decodeHtmlEntities(description)
          }}
        />

        <Divider />

        <Box>
          <FormControl>
            <RadioGroup value={selectedOption} onChange={handleOptionChange}>
              {options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio disabled={isLocked} />} // Disable option if time is out
                  label={
                    <Box
                      component='span'
                      dangerouslySetInnerHTML={{
                        __html: decodeHtmlEntities(option)
                      }}
                    />
                  }
                />
              ))}

              <FormControlLabel
                value='reset'
                control={<Radio disabled={isLocked} />}
                label='Leave Unattended'
                onClick={handleResetChoices}
              />
              <FormControlLabel
                control={<Checkbox size='small' onChange={handleMarkForReviewChange} disabled={isLocked} />}
                sx={{ paddingLeft: 1 }}
                label='Mark for Review'
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  )
}

export default QuestionCard
