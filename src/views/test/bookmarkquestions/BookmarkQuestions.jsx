'use client'
import React, { useEffect } from 'react'
import BookmarkQuestionsTable from './BookmarkQuestionsTable'
import useBookmarkQuestionsApi from '@/api/test/useBookmarkQuestionsApi'
import { Grid } from '@mui/material'
import FilterHeader from '@/Components/globals/FilterHeader'

const BookmarkQuestions = () => {
  const { bookmark, fetchBookmarkData } = useBookmarkQuestionsApi()

  useEffect(() => {
    fetchBookmarkData() // Fetch bookmark data on mount
  }, [])

  return (
    <>
      <FilterHeader title='Bookmark Questions' />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* Render BookmarkQuestionsTable with the original bookmark data */}
          <BookmarkQuestionsTable bookmark={bookmark} />
        </Grid>
      </Grid>
    </>
  )
}

export default BookmarkQuestions
