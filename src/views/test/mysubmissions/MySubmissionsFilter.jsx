import { useState, forwardRef } from 'react'
import { Typography, Grid, TextField, InputAdornment, IconButton } from '@mui/material'
import { format } from 'date-fns'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const PickersComponent = forwardRef(({ start, end, label, ...props }, ref) => {
  const startDateFormatted = start ? format(start, 'MM/dd/yyyy') : ''
  const endDateFormatted = end ? ` - ${format(end, 'MM/dd/yyyy')}` : ''
  const value = `${startDateFormatted}${endDateFormatted}`

  return (
    <TextField
      inputRef={ref}
      fullWidth
      {...props}
      label={label}
      value={value}
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

const MySubmissionsFilter = () => {
  return (
    <Grid container spacing={6} padding={6}>
      <Grid item xs={3}>
        <Typography fontWeight='bold' fontSize={18}>
          Filters
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
        >
          Reset Filter
        </a>
      </Grid>

      <Grid item xs={6}>
        <TextField size='small' placeholder='Search Question' fullWidth />
      </Grid>

      <Grid item xs={6}>
        <AppReactDatepicker
          selectsRange
          shouldCloseOnSelect={false}
          customInput={<PickersComponent label='Test Date' size='small' fullWidth />}
        />
      </Grid>
    </Grid>
  )
}

export default MySubmissionsFilter
