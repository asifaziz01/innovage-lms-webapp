import React, { useState } from 'react'

import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Checkbox,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Grid,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Radio,
  FormControlLabel,
  RadioGroup,
  CircularProgress
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import QuestionGeneralSettingsTimingSection from './QuestionGeneralSettingsTimerSection'
import DialogBoxComponent from '@/components/Common/DialogBoxComponent'

const QuestionGeneralSettings = () => {
  const [openTemplate, setOpenTemplate] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      answer_feedback: 'no',
      no_of_attempts: 'one',
      question_feedback: 'no',
      randomize_answers: 'no',
      randomize_questions: 'no',
      passing_value_select: 'no',
      negative_marks_select: 'no',
      template: 'template_1',
      test_duration: '60',
      question_timer_select: 'no',
      test_timer_select: 'no',
      questionTimeValue: 'second',
      testTimeValue: 'minute',
      backtracking: 'no'
    }
  })

  const handleSaveStatus = () => {
    return null
  }

  const handleNewSubmit = data => {
    // e
    alert('Submitted')
  }

  const handleCloseTemplate = () => {
    setOpenTemplate(false)
  }

  const allValues = watch()

  return (
    <form onSubmit={handleSubmit(handleNewSubmit)}>
      <Grid container spacing={5} xs={12}>
        <Grid item xs={12}>
          <Card
            sx={{
              marginTop: 3
            }}
          >
            <CardContent>
              <Grid item xs={12} py={3}>
                <Grid container item xs={12}>
                  <Grid item xs={12}>
                    <Grid container spacing={5} xs={12}>
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
                          <InputLabel id='country' error={Boolean(errors.type)}>
                            No of Attempts
                          </InputLabel>
                          <Controller
                            name='no_of_attempts'
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                size='small'
                                fullWidth
                                label='No of Attempts'
                                inputProps={{ placeholder: 'No of Attempts' }}
                              >
                                <MenuItem value='one'>1</MenuItem>
                                <MenuItem value='two'>2</MenuItem>
                                <MenuItem value='three'>3</MenuItem>
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Controller
                          name='test_duration'
                          control={control}
                          render={({ field }) => (
                            <TextField {...field} type='number' fullWidth size='small' label='Test Duration (in min)' />
                          )}
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
                          <InputLabel id='country' error={Boolean(errors.type)}>
                            Select Template
                          </InputLabel>
                          <Controller
                            name='template'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                size='small'
                                error={Boolean(errors.template)}
                                fullWidth
                                label='Select Template'
                                inputProps={{ placeholder: 'Select Template' }}
                              >
                                <MenuItem value='template_1'>Template 1</MenuItem>
                                <MenuItem value='template_2'>Template 2</MenuItem>
                                <MenuItem value='template_3'>Template 3</MenuItem>
                              </Select>
                            )}
                          />
                          {errors.template && <FormHelperText error>This field is required.</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} pt={3} display='flex'>
                        <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='flex-start'>
                          <Typography>Do you want to apply negative marking ?</Typography>
                          <Box mt={3} />
                          <Controller
                            name='negative_marks_select'
                            control={control}
                            render={({ field }) => (
                              <RadioGroup
                                {...field}
                                onChange={e => {
                                  if (e?.target?.value === 'no') {
                                    setValue('negative_marks', null)
                                  }

                                  setValue('negative_marks_select', e?.target?.value)
                                }}
                              >
                                <Box display='flex' alignItems='center'>
                                  <FormControlLabel value='yes' control={<Radio />} label='Yes' />
                                  {allValues?.negative_marks_select === 'yes' && (
                                    <Box display='flex' alignItems='center' pt={3}>
                                      <Controller
                                        name='negative_marks'
                                        rules={{ required: true }}
                                        control={control}
                                        render={({ field }) => (
                                          <TextField
                                            placeholder='Negative Marks *'
                                            {...field}
                                            type='number'
                                            fullWidth
                                            {...(errors.negative_marks && {
                                              error: true,
                                              helperText: 'This field is required.'
                                            })}
                                            size='small'
                                            sx={{
                                              paddingX: 2
                                            }}
                                          />
                                        )}
                                      />
                                      <Typography>Marks</Typography>
                                    </Box>
                                  )}
                                </Box>
                                <FormControlLabel value='no' control={<Radio />} label='No' />
                              </RadioGroup>
                            )}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} pt={3}>
                        <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='flex-start'>
                          <Typography>Do you want to apply passing marks ?</Typography>
                          <Box mt={3} />
                          <Controller
                            name='passing_value_select'
                            control={control}
                            render={({ field }) => (
                              <RadioGroup
                                {...field}
                                onChange={e => {
                                  if (e?.target?.value === 'no') {
                                    setValue('passing_marks', null)
                                  }

                                  setValue('passing_value_select', e?.target?.value)
                                }}
                              >
                                <Box display='flex' alignItems='center'>
                                  <FormControlLabel value='yes' control={<Radio />} label='Yes' />
                                  {allValues?.passing_value_select === 'yes' && (
                                    <Box display='flex' alignItems='center' pt={3}>
                                      <Controller
                                        name='passing_marks'
                                        control={control}
                                        rules={{
                                          required: true
                                        }}
                                        render={({ field }) => (
                                          <TextField
                                            placeholder='Passing Marks *'
                                            {...field}
                                            type='number'
                                            {...(errors.passing_marks && {
                                              error: true,
                                              helperText: 'This field is required.'
                                            })}
                                            fullWidth
                                            size='small'
                                            sx={{
                                              paddingX: 2
                                            }}
                                          />
                                        )}
                                      />
                                      <Typography>Marks</Typography>
                                    </Box>
                                  )}
                                </Box>
                                <FormControlLabel value='no' control={<Radio />} label='No' />
                              </RadioGroup>
                            )}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} pt={3}>
                        <QuestionGeneralSettingsTimingSection control={control} heading='Randomize Questions'>
                          <Controller
                            name='randomize_questions'
                            control={control}
                            render={({ field }) => (
                              <RadioGroup {...field}>
                                <FormControlLabel value='yes' control={<Radio />} label='Yes' />
                                <FormControlLabel value='no' control={<Radio />} label='No' />
                              </RadioGroup>
                            )}
                          />
                        </QuestionGeneralSettingsTimingSection>
                      </Grid>
                      <Grid item xs={12} sm={6} pt={3}>
                        <QuestionGeneralSettingsTimingSection control={control} heading='Randomize Answers'>
                          <Controller
                            name='randomize_answers'
                            control={control}
                            render={({ field }) => (
                              <RadioGroup {...field}>
                                <FormControlLabel value='yes' control={<Radio />} label='Yes' />
                                <FormControlLabel value='no' control={<Radio />} label='No' />
                              </RadioGroup>
                            )}
                          />
                        </QuestionGeneralSettingsTimingSection>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card
            sx={{
              marginTop: 3
            }}
          >
            <CardContent>
              <Grid container spacing={5} xs={12}>
                <QuestionGeneralSettingsTimingSection control={control} heading='Test Timer'>
                  <Controller
                    name='test_timer_select'
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        onChange={e => {
                          if (e?.target?.value === 'no') {
                            setValue('question_timer_select', 'no')
                            setValue('test_time', null)
                          }

                          setValue('test_timer_select', e?.target?.value)
                          setValue('question_time', null)
                        }}
                      >
                        <Box display='flex' alignItems='center'>
                          <FormControlLabel value='yes' control={<Radio />} label='Yes' />
                          {allValues?.test_timer_select === 'yes' && (
                            <Controller
                              name='test_time'
                              control={control}
                              rules={{ required: true }}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  variant='outlined'
                                  type='number'
                                  size='small'
                                  {...(errors.test_time && { error: true, helperText: 'This field is required.' })}
                                  placeholder='Test Time * '
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment
                                        position='start'

                                        // sx={{
                                        //   background: '#fafaf9'
                                        // }}
                                      >
                                        <FormControl
                                          sx={{
                                            border: 'none'

                                            // paddingLeft: 0

                                            // background: '#fafaf9'
                                          }}
                                        >
                                          <Controller
                                            name='testTimeValue'
                                            control={control}
                                            render={({ field }) => (
                                              <Select
                                                size='small'
                                                {...field}
                                                sx={{
                                                  '& fieldset': {
                                                    borderTop: 'none',
                                                    borderBottom: 'none',
                                                    borderRight: 'none',
                                                    borderRadius: 0
                                                  } // Removes border from Select
                                                  // paddingLeft: 0
                                                }}
                                              >
                                                <MenuItem value='second'>Second</MenuItem>
                                                <MenuItem value='minute'>Minute</MenuItem>
                                              </Select>
                                            )}
                                          />
                                        </FormControl>
                                      </InputAdornment>
                                    )
                                  }}
                                />
                              )}
                            />
                          )}
                        </Box>
                        <FormControlLabel value='no' control={<Radio />} label='No' />
                      </RadioGroup>
                    )}
                  />
                </QuestionGeneralSettingsTimingSection>
                <QuestionGeneralSettingsTimingSection control={control} heading='Question Timer'>
                  <Controller
                    name='question_timer_select'
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        onChange={e => {
                          if (e?.target?.value === 'no') {
                            setValue('question_time', null)
                          }

                          setValue('question_timer_select', e?.target?.value)
                        }}
                      >
                        <Box display='flex' alignItems='center'>
                          <FormControlLabel value='yes' control={<Radio />} label='Yes' />
                          {allValues?.question_timer_select === 'yes' && (
                            <Controller
                              name='question_time'
                              control={control}
                              rules={{ required: true }}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  variant='outlined'
                                  type='number'
                                  size='small'
                                  {...(errors.question_time && {
                                    error: true,
                                    helperText: 'This field is required.'
                                  })}
                                  placeholder='Question Time * '
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment
                                        position='start'

                                        // sx={{
                                        //   background: '#fafaf9'
                                        // }}
                                      >
                                        <FormControl
                                          sx={{
                                            border: 'none'

                                            // paddingLeft: 0

                                            // background: '#fafaf9'
                                          }}
                                        >
                                          <Controller
                                            name='questionTimeValue'
                                            control={control}
                                            render={({ field }) => (
                                              <Select
                                                size='small'
                                                {...field}
                                                sx={{
                                                  '& fieldset': {
                                                    borderTop: 'none',
                                                    borderBottom: 'none',
                                                    borderRight: 'none',
                                                    borderRadius: 0
                                                  } // Removes border from Select
                                                  // paddingLeft: 0
                                                }}
                                              >
                                                <MenuItem value='second'>Second</MenuItem>
                                                <MenuItem value='minute'>Minute</MenuItem>
                                              </Select>
                                            )}
                                          />
                                        </FormControl>
                                      </InputAdornment>
                                    )
                                  }}
                                />
                              )}
                            />
                          )}
                        </Box>
                        <FormControlLabel value='no' control={<Radio />} label='No' />
                      </RadioGroup>
                    )}
                  />
                </QuestionGeneralSettingsTimingSection>
                <QuestionGeneralSettingsTimingSection control={control} heading='Show question hint during test'>
                  <Controller
                    name='question_feedback'
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field}>
                        <FormControlLabel value='yes' control={<Radio />} label='Yes' />

                        <FormControlLabel value='no' control={<Radio />} label='No' />
                      </RadioGroup>
                    )}
                  />
                </QuestionGeneralSettingsTimingSection>
                <QuestionGeneralSettingsTimingSection control={control} heading='Show answer feedback in report'>
                  <Controller
                    name='answer_feedback'
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field}>
                        <FormControlLabel value='yes' control={<Radio />} label='Yes' />
                        <FormControlLabel value='no' control={<Radio />} label='No' />
                      </RadioGroup>
                    )}
                  />
                </QuestionGeneralSettingsTimingSection>
                <QuestionGeneralSettingsTimingSection control={control} heading='Allow Backtracking'>
                  <Controller
                    name='backtracking'
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field}>
                        <FormControlLabel value='yes' control={<Radio />} label='Yes' />
                        <FormControlLabel value='no' control={<Radio />} label='No' />
                      </RadioGroup>
                    )}
                  />
                </QuestionGeneralSettingsTimingSection>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card
            sx={{
              marginTop: 3
            }}
          >
            <CardContent>
              <Grid container item xs={12}>
                <QuestionGeneralSettingsTimingSection control={control} heading='Feedback Settings'>
                  <Controller
                    name='question_feedback_select'
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label='Question Feedback'
                      />
                    )}
                  />
                  <Controller
                    name='answer_feedback_select'
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label='Answer Feedback'
                      />
                    )}
                  />
                </QuestionGeneralSettingsTimingSection>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }} py={3}>
          <Button size='small' type='submit' variant='contained' sx={{ mr: 2 }}>
            Save Changes
          </Button>
          <Button size='small' variant='outlined' sx={{ mr: 2 }} onClick={() => setOpenTemplate(true)}>
            Save Settings As Template
          </Button>
        </Grid>
      </Grid>
      {openTemplate && (
        <DialogBoxComponent
          open={openTemplate}
          onClose={handleCloseTemplate}
          title='Template Name'
          description='Enter Template Name'
          confirmText='Save'
          onConfirm={handleSaveStatus}
          isTemplateDialog={true}
        >
          <Controller
            name='template_name'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size='small'
                label='Template Name'
                sx={{
                  mt: 5
                }}
              />
            )}
          />
        </DialogBoxComponent>
      )}
    </form>
  )
}

export default QuestionGeneralSettings