'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import useBookmarkQuestionsApi from '@/api/test/useBookmarkQuestionsApi'
import { Card, Checkbox, TablePagination, Grid, Box, IconButton, Typography, Skeleton } from '@mui/material'
import FilterHeader from '@/Components/globals/FilterHeader'

const ViewQuestions = () => {
  const { bookmark, fetchBookmarkData } = useBookmarkQuestionsApi()
  const searchParams = useSearchParams()
  const guid = searchParams.get('guid')
  const [questionData, setQuestionData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookmarkData() // Fetch data on component mount
  }, [])

  useEffect(() => {
    if (guid && bookmark.length) {
      const question = bookmark.find(q => q.question_guid === guid)
      setQuestionData(question)
      setLoading(false)
    }
  }, [guid, bookmark])

  return (
    <>
      <FilterHeader title='View Questions' />

      <Card sx={{ minHeight: '600px', padding: 8 }}>
        {loading ? (
          <Box>
            <Skeleton variant='text' width='50%' height={40} />
            <Skeleton variant='text' width='30%' height={40} />
            <Skeleton variant='rectangular' width='100%' height={200} sx={{ marginTop: 5 }} />
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} variant='rectangular' width='100%' height={60} sx={{ marginTop: 2 }} />
            ))}
          </Box>
        ) : questionData ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant='body1'> Test Name: {questionData.test_name}</Typography>
              <Typography variant='body1'> Test Type: {questionData.test_type}</Typography>
            </Box>
            <Box
              sx={{
                marginTop: 5,
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant='h5'> {questionData.question} </Typography>
            </Box>

            <Box
              sx={{
                padding: 4,
                gap: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {questionData.choices.map((choice, index) => (
                <Card
                  key={index}
                  sx={{
                    minHeight: '40px',
                    Width: '300px',
                    padding: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <Typography variant='h6' sx={{ color: choice.correct_answer === '1' ? '#55A91E' : 'inherit' }}>
                    {choice.choice}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Box>
        ) : (
          <p>No question found...</p>
        )}
      </Card>
    </>
  )
}

export default ViewQuestions
