import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Divider,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Box,
  Menu
} from '@mui/material'
import useDraggableList from './useDraggableList' // Import the custom hook
import Reactquill from './Reactquill'
import axios from 'axios'
import { toast } from 'react-toastify'
import Tablefor from '../import/view/Tablefor'
import { useForm, Controller } from 'react-hook-form'
import QuestionSettings from './QuestionSetting'
import AddUserDrawer from './AddUserDrawer'
import { useSearchParams } from 'next/navigation'

const QuestionCard = ({
  marginLeft,
  width,
  expandedPanels,
  setExpandedPanels,
  isVisible,
  setIsVisible,
  showAnswers,
  setShowAnswers,
  handleCollapseAll,
  toggleAnswer,
  questions,
  selectedQuestions,
  setSelectedQuestions,
  check,
  setEdit,
  edit,
  onEditClick
}) => {
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [editingQuestionId, setEditingQuestionId] = useState(null) // To track which question is being edited
  const [editedText, setEditedText] = useState('') // To store the edited text for a question
  const [editingAnswerId, setEditingAnswerId] = useState(null) // To track which answer is being edited
  const [editedAnswer, setEditedAnswer] = useState('') // To store the edited text for
  // Using a custom hook for drag-and-drop
  const { items: questionList, handleDragStart, handleDragOver, handleDrop } = useDraggableList(questions)
  const [questionData, setQuestionData] = useState(questions)

  const [anchorEl, setAnchorEl] = useState(null)
  const search = useSearchParams()
  const guid = search.get('guid')
  const open = Boolean(anchorEl)
  const [settings, setSettings] = useState({
    questionType: 'mcmc',
    marksPerQuestion: 2,
    negativeMarks: 2,
    timeAllowed: 0,
    timeUnit: 'Second',
    difficultyLevel: 'Low',
    importance: 'Low'
  })

  const handleSettingsChange = newSettings => {
    setSettings(newSettings)
  }

  // Use useEffect to update questionData whenever questions prop changes
  useEffect(() => {
    setQuestionData(questions) // Sync the questions prop with questionData state
  }, [questions, toggleAnswer])
  console.log
  // Function to handle checkbox change
  const handleCheckboxChange = (questionId, isChecked) => {
    if (isChecked) {
      setSelectedQuestions([...selectedQuestions, questionId]) // Add question to selected list
    } else {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId)) // Remove from list
    }
  }
  console.log(selectedQuestions, 'questionsselected')
  const handleExpandClick = () => {
    setIsExpanded(!isExpanded)
  }
  // Handle when the user clicks on a question to edit
  const handleEditClick = (questionId, currentText) => {
    setEditingQuestionId(questionId) // Set the question ID being edited
    setEditedText(currentText) // Set the current text in the input field
    setEditingAnswerId(null)
  }

  // Handle when the user types in the input field
  const handleEditChange = e => {
    setEditedText(e.target.value)
  }
  console.log(questions, 'question12344')
  // Handle when the user presses Enter or blurs out of the input
  const handleEditSave = questionId => {
    const updatedQuestions = questionList.map(question =>
      question.id === questionId ? { ...question, text: editedText } : question
    )
    // Stop editing mode
    // You would ideally call a function here to save the changes to the server or state
    setQuestionData(updatedQuestions)
    setEditingQuestionId(null)
  }
  // Handle when the user clicks on an answer to edit
  const handleEditAnswerClick = (questionId, answerIndex, currentAnswer) => {
    setEditingAnswerId(`${questionId}-${answerIndex}`) // Set the answer ID being edited
    setEditedAnswer(currentAnswer) // Set the current answer in the input field
    setEditingQuestionId(null)
  }

  // Handle answer edit change
  const handleEditAnswerChange = e => {
    setEditedAnswer(e.target.value)
  }
  console.log('hye')
  // Handle saving the edited answer
  const handleEditAnswerSave = (questionId, answerIndex) => {
    const updatedQuestions = questionList.map(question => {
      if (question.id === questionId) {
        const updatedOptions = question.options.map((option, index) => (index === answerIndex ? editedAnswer : option))
        return { ...question, options: updatedOptions }
      }
      return question
    })
    setEditingAnswerId(null) // Stop editing mode for answer
    // You would ideally call a function here to save the changes to the server or state
    console.log('Updated questions with edited answer:', updatedQuestions)
  }
  useEffect(() => {}, [questions, isVisible, expandedPanels, questions])
  console.log(editedAnswer, 'gg')

  const handleImportSelected = async () => {
    if (selectedQuestions.length === 0) {
      toast.error('Please select at least one question.')
      return
    }

    // Create a new FormData object
    const formData = new FormData()
    formData.append('category_guid', guid)
    const selectedQuestionData = questionData.filter(q => selectedQuestions.includes(q.id))

    // Loop through selected questions and append to formData
    selectedQuestionData.forEach((question, index) => {
      // Append question fields in the required form-data format
      formData.append(`questions[${index}][question]`, question.text) // Question text
      // formData.append(`questions[${index}][question_type]`, question.question_type) // Assuming 'mcq' as question type
      // Append question settings for each question
      formData.append(`questions[${index}][difficulty]`, settings.difficultyLevel)
      formData.append(`questions[${index}][test_name]`, settings.testName)
      formData.append(`questions[${index}][type]`, settings.questionType)
      formData.append(`questions[${index}][importance]`, settings.importance)
      formData.append(`questions[${index}][marks]`, settings.marksPerQuestion)
      formData.append(`questions[${index}][category]`, guid)
      formData.append(`questions[${index}][neg_marks]`, settings.negativeMarks)
      formData.append(`questions[${index}][time]`, settings.timeAllowed)
      // formData.append(`questions[${index}][time_unit]`, settings.timeUnit)
      // Append choices for the question
      question.options.forEach((choice, choiceIndex) => {
        formData.append(`questions[${index}][choice][${choiceIndex}]`, choice)
      })

      question.correctanswer.forEach((correctanswer, correctAnswerIndex) => {
        formData.append(`questions[${index}][correct_answer][${correctAnswerIndex}]`, correctanswer)
      })

      // question.order.forEach((order, orderIndex) => {
      //   formData.append(`questions[${index}][order][${orderIndex}]`, order)
      // })
    })

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/questions/save_import`

      const response = await axios.post(
        endpoint,
        formData, // Send the formData object
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`, // Include Authorization header
            Network: process.env.NEXT_PUBLIC_LMS_TOKEN, // Include Network header
            Accept: 'application/json', // Specify accepted response format
            'Content-Type': 'multipart/form-data' // Specify form-data content type
          }
        }
      )

      // Handle success response
      toast.success('Selected questions imported successfully!')

      setQuestionData(selectedQuestionData)
    } catch (error) {
      toast.error('Failed to import selected questions.')
    }
  }
  const handleExpandAllButton = () => {
    setIsVisible(true) // Show the questions
    setExpandedPanels(questionData.map(q => q.id)) // Expand all panels
    setShowAnswers(questionData.map(q => q.id)) // Reset showing answers (no answers shown)
    // setIsExpandedAll(true) // Set the expanded state
  }
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // Handler for "Import All"
  const handleImportAll = () => {
    setAnchorEl(null)
    // Add your logic for "Import All" here
  }

  const handleDeleteClick = async () => {
    if (selectedQuestions.length === 0) {
      toast.error('Please select at least one question to delete.')
      return
    }
    console.log(isVisible, 'jjjjj')
    // Get selected questions' GUIDs
    const selectedQuestionGuids = questionData
      .filter(question => {
        console.log(question, 'uuuuuu') // Log each question object
        return selectedQuestions.includes(question.id) // Filter selected questions by their id
      })
      .map(question => question.guid) // Map to GUID

    try {
      // Send the selected question GUIDs to the API for deletion
      const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL}qb/questions/${selectedQuestionGuids}/delete`

      await axios.delete(
        endpoint,
        {},
        // Send the GUIDs in the request body
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`,
            Network: process.env.NEXT_PUBLIC_LMS_TOKEN,
            Accept: 'application/json'
          }
        }
      )
      // Filter out deleted questions from local state
      const updatedQuestionData = questionData.filter(question => !selectedQuestionGuids.includes(question.guid))

      setQuestionData(updatedQuestionData) // Update state with remaining questions
      setSelectedQuestions([]) // Clear selected questions
      toast.success('Selected questions deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete selected questions.')
    }
  }

  console.log(expandedPanels, 'showanswert')
  const decodeHtmlEntities = html => {
    const txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value // Return the decoded string
  }
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleOpenSettings = () => {
    setIsSettingsOpen(true)
  }

  const handleCloseSettings = () => {
    setIsSettingsOpen(false)
  }
  const handleSaveSettings = settings => {
    setIsSettingsOpen(false)
    // Apply the settings globally or pass them to the relevant component
  }
  const setDifficulty = value => setSettings(prev => ({ ...prev, difficultyLevel: value }))
  const setTestName = value => setSettings(prev => ({ ...prev, testName: value }))
  const setCategory = value => setSettings(prev => ({ ...prev, questionType: value }))
  const setImportance = value => setSettings(prev => ({ ...prev, importance: value }))
  const setMarks = value => setSettings(prev => ({ ...prev, marksPerQuestion: value }))
  const setNegativeMarks = value => setSettings(prev => ({ ...prev, negativeMarks: value }))
  const setTime = value => setSettings(prev => ({ ...prev, timeAllowed: value }))
  const setTimeUnit = value => setSettings(prev => ({ ...prev, timeUnit: value }))
  console.log(settings.questionType, 'questiontype')
  return (
    <>
      {check && (
        <>
          <Tablefor
            handleExpandAll={handleExpandAllButton}
            handleCollapseAll={handleCollapseAll}
            handleImportSelected={handleImportSelected}
            open={isSettingsOpen}
            handleClose={handleCloseSettings}
            handleSave={handleSaveSettings}
            addUserOpen={addUserOpen}
            setAddUserOpen={setAddUserOpen}
          />
        </>
      )}
      <AddUserDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        settings={settings}
        onSaveSettings={handleSettingsChange}
      />
      <Card style={{ marginTop: '50px', marginLeft: marginLeft, padding: '20px', width: width }}>
        <CardHeader
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedQuestions && selectedQuestions.includes(questions.id)}
                    onChange={e => handleCheckboxChange(questions.id, e.target.checked)}
                  />
                }
                style={{ marginRight: '10px' }}
              />
            </div>
          }
          subheaderTypographyProps={{ style: { color: '#262B43E5', fontSize: '13px' } }}
          action={
            <>
              <Button
                variant='contained'
                startIcon={<i className='ri-download-2-line' style={{ color: 'white' }} />}
                onClick={handleClick} // Open the dropdown menu on button click
              >
                Import
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                <MenuItem onClick={handleImportAll}>Import All</MenuItem>
                <MenuItem onClick={handleImportSelected}>Import Selected</MenuItem>
              </Menu>
            </>
          }
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}></div>

        {isVisible && (
          <CardContent>
            {questionData.length > 0 &&
              questionData.map((question, index) => {
                const processedText =
                  question?.text !== null && question?.text?.startsWith('#')
                    ? question?.text?.slice(1).trim()
                    : question?.text
                console.log(question && question.correctanswer && question.correctanswer[index] === '1', 'questiondemo')
                return (
                  <>
                    <Accordion
                      key={question.id}
                      expanded={showAnswers.includes(question.id)} // Check if this question is in the expandedPanels array
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      draggable
                      style={{
                        padding: '10px',
                        margin: '5px 0',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer'
                        // boxShadow: 'none',
                        // border: 'none'
                      }}
                      sx={{ '& .MuiAccordionSummary-expandIconWrapper': { display: 'none' } }} // Th
                    >
                      <AccordionSummary aria-controls={`panel${question.id}-content`} id={`panel${question.id}-header`}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          {/* Checkbox for selecting questions */}
                          <FormControlLabel
                            aria-label='Select'
                            control={
                              <Checkbox
                                checked={selectedQuestions && selectedQuestions.includes(question.id)} // Check if this question is selected
                                onChange={e => handleCheckboxChange(question.id, e.target.checked)} // Handle checkbox change
                              />
                            }
                            label=''
                            style={{ marginRight: '10px' }}
                          />
                          {/* Editable question text */}
                          <Typography
                            variant='body1'
                            style={{ flexGrow: 1, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            onClick={() => handleEditClick(question.id, processedText)} // Switch to editing mode on click
                            dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(`${index + 1}. ${question.text}`) }}
                          >
                            {/* {index + 1}. {processedText} */}
                          </Typography>
                          <Divider />
                          <Button
                            style={{ marginLeft: '20px' }}
                            variant='text'
                            onClick={e => {
                              e.stopPropagation() // Prevent accordion toggle
                              toggleAnswer(question.id)
                            }}
                          >
                            {showAnswers.includes(question.id) ? (
                              <i className='ri-arrow-up-s-line' style={{ color: '#262B43E5' }} />
                            ) : (
                              <i className='ri-arrow-down-s-line' style={{ color: '#262B43E5' }} />
                            )}
                          </Button>
                        </div>
                      </AccordionSummary>
                      {showAnswers.includes(question.id) && (
                        <AccordionDetails style={{ marginLeft: '40px' }}>
                          {question.options ? (
                            <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                              {question.options.map((option, index) => (
                                <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                  <Checkbox
                                    checked={question && question.correctanswer && question.correctanswer[index] === 1} // Check if the option is the correct one
                                    disabled // Disable checkbox to prevent user interaction
                                    sx={{
                                      '&.Mui-checked': {
                                        color: '#34C759' // Green color for the correct answer
                                      }
                                    }}
                                  />
                                  {editingAnswerId === `${question.id}-${index}` ? (
                                    <Reactquill
                                      value={editedAnswer}
                                      onChange={setEditedAnswer}
                                      style={{ backgroundColor: 'white', flexGrow: 1 }} // Use flexGrow to take remaining space
                                      onBlur={() => handleEditAnswerSave(question.id, index)} // Save on blur
                                      onKeyPress={e => {
                                        if (e.key === 'Enter') handleEditAnswerSave(question.id, index) // Save on pressing Enter
                                      }}
                                      autoFocus
                                      fullWidth
                                    />
                                  ) : (
                                    <Typography
                                      style={{
                                        color: question.correctanswer[index] === '1' ? '#34C759' : 'black',
                                        flexGrow: 1, // Use flexGrow to take remaining space
                                        cursor: 'pointer'
                                      }}
                                      onClick={() => handleEditAnswerClick(question.id, index, option)} // Switch to editing mode on click
                                      dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(option) }}
                                    >
                                      {/* {option} */}
                                    </Typography>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <Typography variant='body2' style={{ whiteSpace: 'pre-line' }}>
                              {question.sampleAnswer}
                            </Typography>
                          )}

                          <Accordion expanded={isExpanded} onChange={handleExpandClick} style={{ border: 'none ' }}>
                            <AccordionSummary
                            //  expandIcon={
                            // <ExpandMoreIcon />
                            // }
                            >
                              <Typography>
                                {isExpanded ? 'Hide' : 'Show'} {isExpanded ? '▲' : '▼'}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                {/* Difficulty */}
                                <Grid item xs={3}>
                                  <FormControl fullWidth size='small'>
                                    <InputLabel>Difficulty</InputLabel>
                                    <Select
                                      value={settings.difficultyLevel}
                                      onChange={e => setDifficulty(e.target.value)}
                                    >
                                      <MenuItem value='Low'>Low</MenuItem>
                                      <MenuItem value='Medium'>Medium</MenuItem>
                                      <MenuItem value='High'>High</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                {/* Test Name */}
                                <Grid item xs={3}>
                                  <FormControl size='small' fullWidth>
                                    <InputLabel>Test Name</InputLabel>
                                    <Select value={settings.testName} onChange={e => setTestName(e.target.value)}>
                                      <MenuItem value='Math Test'>Maths Test</MenuItem>
                                      <MenuItem value='Exam'>English Test</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                {/* Category */}
                                <Grid item xs={3}>
                                  <FormControl size='small' fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select value={settings.questionType} onChange={e => setCategory(e.target.value)}>
                                      <MenuItem value='mcmc'>MCQ</MenuItem>
                                      <MenuItem value='True/False'>True/False</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                {/* Importance */}
                                <Grid item xs={3}>
                                  <FormControl fullWidth size='small'>
                                    <InputLabel>Importance</InputLabel>
                                    <Select value={settings.importance} onChange={e => setImportance(e.target.value)}>
                                      <MenuItem value='Low'>Low</MenuItem>
                                      <MenuItem value='Medium'>Medium</MenuItem>
                                      <MenuItem value='High'>High</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>

                                {/* Marks */}
                                <Grid item xs={4}>
                                  <TextField
                                    fullWidth
                                    size='small'
                                    label='Marks'
                                    type='number'
                                    value={settings.marksPerQuestion}
                                    onChange={e => setMarks(e.target.value)}
                                  />
                                </Grid>
                                {/* Negative Marks */}
                                <Grid item xs={4}>
                                  <TextField
                                    fullWidth
                                    size='small'
                                    label='Negative Marks'
                                    type='number'
                                    value={settings.negativeMarks}
                                    onChange={e => setNegativeMarks(e.target.value)}
                                  />
                                </Grid>
                                {/* Time */}
                                <Grid item xs={4} sm={4}>
                                  <FormControl fullWidth size='small'>
                                    <Box display='flex' alignItems='center'>
                                      <TextField
                                        label='Time Allowed'
                                        name='timeAllowed'
                                        type='number'
                                        value={settings.timeAllowed}
                                        onChange={e => setTime(e.target.value)}
                                        style={{ flex: 2, marginRight: '10px' }} // Adjusts input width
                                        size='small'
                                      />
                                      <Select
                                        name='timeUnit'
                                        value={settings.timeUnit}
                                        onChange={e => setTimeUnit(e.target.value)}
                                        style={{ flex: 1 }} // Dropdown size
                                      >
                                        <MenuItem value='Second'>Second</MenuItem>
                                        <MenuItem value='Minute'>Minute</MenuItem>
                                      </Select>
                                    </Box>
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </AccordionDetails>
                      )}
                      {/* <Button
                        style={{ color: 'rgba(38, 43, 67, 0.898)', marginTop: '10px' }}
                        // onClick={() => handleAccordionClick(question.guid)}
                      >
                        <i className='ri-delete-bin-7-line' style={{ color: 'rgba(38, 43, 67, 0.898)' }}></i>
                      </Button> */}
                      <Button
                        style={{ color: 'rgba(38, 43, 67, 0.898)', marginTop: '10px' }}
                        onClick={() => onEditClick(question)}
                      >
                        <i className='ri-edit-box-line' style={{ color: 'rgba(38, 43, 67, 0.898)' }}></i>
                      </Button>
                    </Accordion>
                  </>
                )
              })}
          </CardContent>
        )}
      </Card>
    </>
  )
}

export default QuestionCard
//}tests/save_uploaded_questions/SAM8 api save
