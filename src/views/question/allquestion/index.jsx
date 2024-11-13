'use client'
import React, { useEffect, useState, useCallback } from 'react'
import '../../style/styles.css'
// import useQuestionApi from '../../Api/useQuestionApi'
import QuestionCard from '../list/QuestionCard'
import {
  Grid,
  Box,
  CircularProgress,
  FormControl,
  CardHeader,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Card
} from '@mui/material'
import TableFilters from '../list/TableFilters'
import TestCard from '../list/TestCard'
import QuickLinksCard from '../list/QuickLinkCards'
import useQuestionModuleApi from '@/api/useQuestionModuleApi'
// import QuestionCardBankModule from '../list/QuestionCardBankModule'
import PaginationCard from '@/api/Pagination'
import Sortingquestion from '../list/Sortingquestion'
import Topcard from '../list/Topcard'
import FilterHeader from '@/Components/globals/FilterHeader'
import { useSearchParams } from 'next/navigation'
import QuestionCardBankModule from '../list/QuestionCardBankModule'
const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(null, args)
    }, delay)
  }
}
const AllQuestionList = () => {
  const {
    allquestionData,
    setallquestionData,
    fetchDataallquestion,
    loader,
    searchKeyword,
    setSearchKeyword,
    BulkDelete,
    deleteSingleQuestion
  } = useQuestionModuleApi()

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  // const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
  // const [showCategory, setShowCategory] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [expandedPanels, setExpandedPanels] = useState([]) // Tracks which panels are expanded
  const [isVisible, setIsVisible] = useState(true) // Controls visibility of questions
  const [showAnswers, setShowAnswers] = useState([]) // Tracks which panels' answers are shown
  const [sortOption, setSortOption] = useState(null)
  const [selectedType, setSelectedType] = useState('')
  const [order, setOrder] = useState('')
  // const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState(searchKeyword)
  const [localSearch, setLocalSearch] = useState('') // local state for search input
  const [isExpandedAll, setIsExpandedAll] = useState(false) // Tracks if all are expanded
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(() => {
    // Initialize state from localStorage or default to false
    const savedValue = localStorage.getItem('showCorrectAnswer')
    return savedValue !== null ? JSON.parse(savedValue) : false
  })
  const [showCategory, setShowCategory] = useState(() => {
    return JSON.parse(localStorage.getItem('showCategory')) || false // Initialize from localStorage
  })
  const [showFields, setShowFields] = useState(() => {
    return JSON.parse(localStorage.getItem('showFields')) || false // Initialize from localStorage
  })
  const param = useSearchParams()
  const guid = param.get('guid')
  // Effect to update localStorage whenever showCorrectAnswer changes
  useEffect(() => {
    localStorage.setItem('showCorrectAnswer', JSON.stringify(showCorrectAnswer))
    localStorage.setItem('showCategory', JSON.stringify(showCategory))
    localStorage.setItem('showFields', JSON.stringify(showFields))
  }, [showCorrectAnswer, showCategory, showFields])
  // Debounce effect to delay the API call until the user stops typing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchKeyword(localSearch) // Only set search keyword after delay
    }, 500) // 500ms delay

    return () => clearTimeout(delayDebounceFn) // Cleanup the timeout
  }, [localSearch, setSearchKeyword])
  useEffect(() => {
    fetchDataallquestion({
      searchKeyword: searchKeyword,
      page: currentPage,
      results_per_page: rowsPerPage,
      type: selectedType,
      order: order
    })
  }, [currentPage, rowsPerPage, selectedType, order, searchKeyword])

  useEffect(() => {
    if (allquestionData && allquestionData.meta) {
      setTotalPages(Math.ceil(allquestionData.meta.total_results / rowsPerPage))
    }
  }, [allquestionData, rowsPerPage])
  console.log(allquestionData && allquestionData.pagination, 'kkkk')
  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = rows => {
    setRowsPerPage(rows)
    setCurrentPage(1) // Reset to the first page when changing rows per page
  }
  console.log('1234')
  // Handle search input
  const handleSearch = debounce(event => {
    setSearchKeyword(event.target.value) // Update the search keyword
  }, 500) // 500ms delay before making the API call

  const handleExpandAll = () => {
    // setIsVisible(true) // Show the questions
    // setExpandedPanels(questions.map(q => q.id)) // Expand all panels
    // setShowAnswers([]) // Reset showing answers (no answers shown)
    // setIsExpandedAll(true) // Set the expanded state
  }
  const handleExpandAllButton = () => {
    setIsVisible(true) // Show the questions
    setExpandedPanels(questions.map(q => q.id)) // Expand all panels
    setShowAnswers(questions.map(q => q.id)) // Reset showing answers (no answers shown)
    // setIsExpandedAll(true) // Set the expanded state
  }
  // Function to collapse all accordions and hide everything
  const handleCollapseAll = () => {
    // setExpandedPanels([]) // Collapse all panels
    // setIsVisible(false) // Hide the questions
    // setShowAnswers([]) // Reset answers visibility
    // setIsExpandedAll(false) // Reset the expanded state
  }
  console.log(order, 'sssssssssssss')
  // Function to toggle the answer visibility of a specific question
  const toggleAnswer = questionId => {
    setShowAnswers(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId) // Remove from shown
      } else {
        return [...prev, questionId] // Add to shown
      }
    })
  }

  // Track selected checkboxes in QuestionCard
  //   console.log(questions, 'questions')
  // Pass this to QuestionCard to manage checkbox selections
  const handleCheckboxChange = (questionId, isChecked) => {
    console.log(questionId)
    if (isChecked) {
      setSelectedQuestions([...selectedQuestions, questionId]) // Add question to selected list
    } else {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId)) // Remove from list
    }
  }
  // To track which questions have correct answers shown

  // Function to toggle showing the correct answer

  const handleDeleteClick = () => {
    if (selectedQuestions.length > 0) {
      setOpenDeleteDialog(true)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      // Call the delete function from your API hook
      await BulkDelete(selectedQuestions) // Assuming deleteQuestions accepts an array of IDs
      console.log('Deleted questions:', selectedQuestions)
      setSelectedQuestions([]) // Clear the selected questions
      setOpenDeleteDialog(false) // Close the dialog
      fetchDataallquestion(currentPage, rowsPerPage) // Refresh the questions list after deletion
    } catch (error) {
      console.error('Error deleting questions:', error)
    }
  }
  useEffect(() => {
    if (!sortOption) {
      // If no option is selected (unchecking), reset filters
      setSelectedType(null)
      setOrder(null)
    }
    if (sortOption === 'multiple_choice_question') {
      setSelectedType('mcmc')
    }
    if (sortOption === 'true_false') {
      setSelectedType('tf')
    }
    if (sortOption === 'question_asc') setOrder('title_asc')
    if (sortOption === 'question_desc') {
      setOrder('title_desc')
    }
    if (sortOption === 'creation_date_asc') {
      setOrder('newest_first')
    }
    if (sortOption === 'creation_date_desc') {
      setOrder('newest_last')
    }
    // else {
    //   setSelectedType(null)
    //   setOrder(null)
    // }
  }, [sortOption, selectedType])
  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
  }
  const questions =
    allquestionData &&
    allquestionData.data
      ?.filter(item => item.question !== null) // Filter out items with a null question
      .map((item, index) => ({
        guid: item.guid,
        id: (currentPage - 1) * rowsPerPage + index + 1,
        text: item.question, // No need for null check here since it's already filtered
        options: item.choices.map(choice => choice.choice), // Map the options
        correctanswer: item.choices.map(choice => choice.correct_answer), // Map correct answers
        marks: item.marks,
        creationDate: item.created_on,
        question_type: item.question_type,
        neg_marks: item.neg_marks,
        time: item.time
      }))
  const filteredQuestions = questions?.filter(question =>
    question.text.toLowerCase().includes(searchKeyword.toLowerCase())
  )
  const width = 'auto'
  const deleteIconActive = selectedQuestions.length > 0
  console.log(filteredQuestions, 'questions')

  // Function to handle sort change
  const handleSortChange = sortType => {
    setSortOption(sortType)
  }

  // Sorting logic
  const applySort = questions => {
    const stripHtmlTags = text => {
      const parser = new DOMParser()
      const parsedHtml = parser.parseFromString(text, 'text/html')
      return parsedHtml.body.textContent || ''
    }

    const cleanText = text => {
      // Remove HTML tags
      let strippedText = stripHtmlTags(text)

      strippedText = strippedText.replace(/<\/?[^>]+>/gi, '').replace(/[^a-zA-Z0-9\s]/g, '') // Remove all non-alphanumeric characters except spaces

      // Step 3: Trim spaces from start and end
      return strippedText.trim()
    }
    // if (sortOption === 'creation_date_asc') {
    //   return questions.sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate))
    // } else if (sortOption === 'creation_date_desc') {
    //   return questions.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))
    // }
    //  else if (sortOption === 'question_asc') {
    //   const sortedQuestions = questions.sort((a, b) => {
    //     console.log(cleanText(a.text), 'cleaned a.text')
    //     console.log(cleanText(b.text), 'cleaned b.text')
    //     return cleanText(a.text).localeCompare(cleanText(b.text))
    //   })

    //   console.log(sortedQuestions, 'Sorted by question (asc)')
    //   return sortedQuestions
    // } else if (sortOption === 'question_desc') {
    //   const sortedQuestions = questions.sort((a, b) => stripHtmlTags(b.text).localeCompare(stripHtmlTags(a.text)))
    //   console.log(sortedQuestions, 'Sorted by question (desc)')
    //   return sortedQuestions
    // }
    // else if (sortOption === 'multiple_choice_question') {
    //   console.log(
    //     'Question types for multiple_choice:',
    //     questions.map(q => q.question_type)
    //   ) // Debugging
    //   return questions.filter(q => q.question_type === 'mcmc')
    // } else if (sortOption === 'true_false') {
    //   console.log(
    //     'Question types for multiple_choice:',
    //     questions.map(q => q.question_type)
    //   ) // Debuggin
    //   return questions.filter(q => q.question_type === 'tf')
    // }
    return questions
  }

  const sortedQuestions = applySort(filteredQuestions)
  return (
    <>
      {/* <TableFilters
        setData={setFilteredData}
        tableData={allquestionData}
        handleExpandAll={handleExpandAllButton}
        handleCollapseAll={handleCollapseAll}
        expandedPanels={expandedPanels}
        // handleToggle={handleToggle}
        selectedQuestions={selectedQuestions}
        deleteIconActive={deleteIconActive}
        onDeleteClick={handleDeleteClick}
      /> */}
      <FilterHeader title='All Questions' subtitle='Orders placed across your store' link='/test/list'></FilterHeader>

      <Card
        sx={{
          padding: '20px',
          borderRadius: '15px',
          border: '1px solid #d3d3d3',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          width: '100%',
          marginBottom: '20px',
          boxSizing: 'border-box'
        }}
      >
        <Topcard
          handleSortChange={handleSortChange}
          onDeleteClick={handleDeleteClick}
          deleteIconActive={deleteIconActive}
          // searchKeyword={searchKeyword}
          handleSearch={e => setLocalSearch(e.target.value)}
          searchKeyword={localSearch}
          showCorrectAnswer={showCorrectAnswer} // Pass state to Topcard
          setShowCorrectAnswer={setShowCorrectAnswer}
          showCategory={showCategory}
          setShowCategory={setShowCategory}
          setShowFields={setShowFields}
          showFields={showFields}
        />
        {/* <Sortingquestion onSortChange={handleSortChange} /> */}
        {/* <Card> */}
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* <Grid item xs={12}> */}
            {/* <Grid container spacing={5} alignItems='center'>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth sx={{ marginBottom: '10px' }}>
                    <CardHeader title='Filter' />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ paddingLeft: '15px' }}>
                    <TextField
                      label='Search Questions'
                      value={searchKeyword}
                      onChange={handleSearch}
                      variant='outlined'
                    />
                  </FormControl>
                </Grid>
              </Grid> */}
            {sortedQuestions && sortedQuestions.length > 0 ? (
              <QuestionCardBankModule
                handleSearch={handleSearch}
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                allquestion={'true'}
                //   userListTable={'true'}
                marginLeft={'17px'}
                width={'100%'}
                expandedPanels={expandedPanels}
                setExpandedPanels={setExpandedPanels}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                showAnswers={showAnswers}
                setShowAnswers={setShowAnswers}
                handleCollapseAll={handleCollapseAll}
                handleExpandAll={handleExpandAll}
                toggleAnswer={toggleAnswer}
                questions={sortedQuestions}
                isExpandedAll={isExpandedAll}
                setIsExpandedAll={setIsExpandedAll}
                handleCheckboxChange={handleCheckboxChange}
                selectedQuestions={selectedQuestions}
                setSelectedQuestions={setSelectedQuestions}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                showCorrectAnswer={showCorrectAnswer}
                showCategory={showCategory}
                showFields={showFields}
                deleteSingleQuestion={deleteSingleQuestion}
              />
            ) : (
              <>
                <Box className='loader' style={{ textAlign: 'center', padding: '50px 0px' }}>
                  {/* <CircularProgress /> */}
                  No result found
                </Box>
              </>
            )}
            {/* </Grid> */}
            {/* <Grid item xs={4} sm={4} md={6} lg={3} style={{ marginRight: '25px' }}>
            <TestCard />
            <QuickLinksCard />
          </Grid> */}
          </Grid>
        </Grid>

        <Grid item xs={12} md={12}>
          {/* <div style={{ width: '60%' }}> */} {/* Set the width to 50% */}
          <PaginationCard
            rowsPerPage={rowsPerPage} // e.g., 10
            currentPage={currentPage} // e.g., 1
            totalPages={totalPages} // e.g., 5
            onPageChange={handlePageChange} // Your function to handle page changes
            onRowsPerPageChange={handleRowsPerPageChange} // Your function to handle rows per page change
          />
          {/* </div> */}
        </Grid>
      </Card>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '600px' } }} // Setting the width and maxWidth
      >
        <DialogTitle id='alert-dialog-title'>{'Delete Questions'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>Are you sure you want to delete ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            style={{ border: '1px solid black', color: 'black', height: '38px', width: '94px' }}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant='contained' style={{ height: '38px', width: '94px' }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* </Card> */}
    </>
  )
}

export default AllQuestionList
