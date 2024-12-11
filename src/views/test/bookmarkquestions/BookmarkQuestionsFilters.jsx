// BookmarkQuestionsFilters.js
import { useState, useEffect, forwardRef } from 'react'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { Checkbox, InputAdornment, ListItemText, TextField, Typography, IconButton } from '@mui/material'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const PickersComponent = forwardRef(({ ...props }, ref) => {
  return (
    <TextField
      inputRef={ref}
      fullWidth
      {...props}
      label={props.label || ''}
      className='is-full'
      error={props.error}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton size='small'>
              <i className='ri-calendar-fill'></i>
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
})

const BookmarkQuestionsFilters = ({
  setFilteredData,
  bookmark,
  testNameFilter,
  setTestNameFilter,
  questionFilter,
  setQuestionFilter,
  bookmarkDateFilter,
  setBookmarkDateFilter
}) => {
  // States
  const [types, setTypes] = useState([])
  const [status, setStatus] = useState([])

  useEffect(() => {
    const filteredData = bookmark.filter(item => {
      const [startDate, endDate] = bookmarkDateFilter // Destructure date range

      // Check if question matches
      if (questionFilter && !item.question.toLowerCase().includes(questionFilter.toLowerCase())) return false

      // Check if test name matches
      if (testNameFilter.length && !testNameFilter.includes(item.test_name)) return false

      // Check if bookmark date is within the selected range
      const bookmarkDate = new Date(item.bookmarked_on)
      if (startDate && endDate && !(bookmarkDate >= new Date(startDate) && bookmarkDate <= new Date(endDate)))
        return false

      return true // Pass all filters
    })

    setFilteredData(filteredData)
  }, [bookmark, questionFilter, testNameFilter, bookmarkDateFilter, setFilteredData])

  const handleStartEndDateChange = dates => {
    setBookmarkDateFilter(dates)
  }

  return (
    <CardContent>
      <Grid container spacing={5} xs={12} display='flex' alignItems='center' pr={0}>
        <Grid item container xs={12} display='flex' justifyContent='space-between'>
          <Grid item xs={3}>
            <Typography fontWeight='bold' fontSize={18}>
              Filter
            </Typography>
          </Grid>
          <Grid item xs={9} display='flex' justifyContent='flex-end'>
            <a
              style={{
                cursor: 'pointer',
                color: '#FF4D49',
                textDecoration: 'underline',
                fontWeight: 500,
                fontSize: 15,
                textUnderlineOffset: 3
              }}
              onClick={() => {
                setStatus([])
                setTestNameFilter([])
                setQuestionFilter('')
                setBookmarkDateFilter([null, null]) // Reset date range
              }}
            >
              Reset Filter
            </a>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            size='small'
            value={questionFilter}
            onChange={e => setQuestionFilter(e.target.value)}
            placeholder='Search Question'
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <AppReactDatepicker
            selectsRange // Use selectsRange for range selection
            startDate={bookmarkDateFilter[0]} // Start date
            endDate={bookmarkDateFilter[1]} // End date
            onChange={handleStartEndDateChange} // Handle date changes
            dateFormat='yyyy-MM-dd'
            customInput={<PickersComponent label='Bookmark Date Range' size='small' />}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                height: '40px',
                minHeight: 'auto'
              },
              '& .MuiInputLabel-root': {
                top: '-7px'
              }
            }}
          >
            <InputLabel id='test-name-select'>Test Name</InputLabel>
            <Select
              id='select-test-name'
              label='Test Name'
              size='small'
              value={testNameFilter}
              labelId='test-name-select'
              multiple
              onChange={event => setTestNameFilter(event.target.value)}
              renderValue={selected => selected.join(', ')}
            >
              {bookmark.map(item => (
                <MenuItem key={item.test_name} value={item.test_name}>
                  <Checkbox checked={testNameFilter.indexOf(item.test_name) > -1} />
                  <ListItemText primary={item.test_name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default BookmarkQuestionsFilters
