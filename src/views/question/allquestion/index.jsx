'use client'
import React, { useEffect, useState, useCallback } from 'react'
import '../../style/styles.css'
import {
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Card
} from '@mui/material'

import useQuestionModuleApi from '@/api/useQuestionModuleApi'
import useImportanceApi from '@/api/useImportanceApi'

import PaginationCard from '@/api/Pagination'
import Sortingquestion from '../list/Sortingquestion'

import Topcard from '../list/Topcard'
import FilterHeader from '@/Components/globals/FilterHeader'
import { useSearchParams } from 'next/navigation'
import QuestionCardBankModule from '../list/QuestionCardBankModule'
import useCategoryApi from '@/api/useCategoryApi'
import { useRouter } from 'next/navigation'
import DialogBox from '../list/DialogBox'
import { useForm } from 'react-hook-form'
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
    deleteSingleQuestion,
    trashData,
    trashDifficultyData,
    resetQuestionData,
    BulkDeleteQuestion,
    addSection
  } = useQuestionModuleApi()
  const { fetchImportanceData } = useImportanceApi
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  // const [selectAll, setSelectAll] = useState('')
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
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [order, setOrder] = useState('')
  const [checkStatus, setCheckStatus] = useState('Active')
  const [categoryGuid, setCategoryGuid] = useState('')
  // const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState(searchKeyword)
  const [localSearch, setLocalSearch] = useState('') // local state for search input
  const [isExpandedAll, setIsExpandedAll] = useState(true) // Tracks if all are expanded
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [trashOpen, setTrashOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [description, setDescription] = useState('')
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(() => {
    // Initialize state from localStorage or default to false
    const savedValue = localStorage.getItem('showCorrectAnswer')
    return savedValue !== null ? JSON.parse(savedValue) : false
  })
  console.log(trashData, 'trash')
  const [showCategory, setShowCategory] = useState(() => {
    return JSON.parse(localStorage.getItem('showCategory')) || false // Initialize from localStorage
  })
  const [showFields, setShowFields] = useState(() => {
    return JSON.parse(localStorage.getItem('showFields')) || false // Initialize from localStorage
  })
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('Categories')
  const { data } = useCategoryApi()
  const param = useSearchParams()
  const guid = param.get('guid')
  const router = useRouter()
  const [isTrash, setIsTrash] = useState(false)
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
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      description: ''
      // type: '',
    }
  })
  console.log(description, 'description')
  const onSubmit = data => {
    const newUser = {
      // avatar: `/images/avatars/${Math.floor(Math.random() * 8) + 1}.png`,
      // title: data.title,
      description: description
      // type: data.type,
      // parent: selectedCategories[selectedCategories.length - 1],
      // created_on: moment().format('YYYY-MM-DD HH:mm:ss'),

      // optional parameters
      // created_by: 'ADJ20',
      // status: '0'
    }

    addSection(newUser)
    setAddUserOpen(!addUserOpen)
    setDescription(null)
    // setFormData(initialData)
    resetForm({ description: '' })
    console.log(description, 'setDescriprion')
  }
  const handleReset = () => {
    setAddUserOpen(!addUserOpen)
    // setFormData(initialData)
    setDescription('')
  }

  const handleCategoryTitle = category => {
    console.log(allquestionData, '1234')
    console.log(category, 'selected category')
    setSelectedCategory(category.title)
    setCategoryGuid(category.guid)

    setIsDropdownOpen(false)
  }

  const handleCategoryChange = event => {
    const value = event.target.value
    setSelectedCategory(value)
    console.log('Selected Category ID:', value)
  }
  console.log(categoryGuid, 'selectedcategory')
  useEffect(() => {
    fetchDataallquestion({
      searchKeyword: searchKeyword,
      page: currentPage,
      results_per_page: rowsPerPage,
      type: selectedType,
      order: order,
      category: categoryGuid
    })
  }, [currentPage, rowsPerPage, selectedType, order, searchKeyword, selectedCategory])
  console.log(selectedType, 'typeselectedchecking')
  useEffect(() => {
    const dataSource = isTrash ? trashData : allquestionData
    if (dataSource && dataSource.meta) {
      setTotalPages(Math.ceil(dataSource.meta.total_results / rowsPerPage))
    }
  }, [allquestionData, trashData, rowsPerPage, isTrash])

  console.log(allquestionData?.meta?.total_results, 'kkkk')
  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = rows => {
    setRowsPerPage(rows)
    setCurrentPage(1) // Reset to the first page when changing rows per page
  }
  useEffect(() => {
    trashDifficultyData()
  }, [])
  const showAllQuestion = () => {
    // if(allquestionData.length>0){
    const totalresults = allquestionData?.meta?.total_results
    fetchDataallquestion({ results_per_page: totalresults })
    setShowAll(true)
    // }
  }
  console.log(allquestionData, '1234')
  // Handle search input
  const handleSearch = debounce(event => {
    setSearchKeyword(event.target.value) // Update the search keyword
  }, 500) // 500ms delay before making the API call

  const handleExpandAll = () => {}

  // Function to collapse all accordions and hide everything
  const handleCollapseAll = () => {}
  console.log(order, 'sssssssssssss')
  // Function to toggle the answer visibility of a specific question
  const toggleAnswer = questionId => {
    // setShowAnswers(prev => {
    //   if (prev.includes(questionId)) {
    //     return prev.filter(id => id !== questionId) // Remove from shown
    //   } else {
    //     return [...prev, questionId] // Add to shown
    //   }
    // })
  }

  // Track selected checkboxes in QuestionCard
  //   console.log(questions, 'questions')
  // Pass this to QuestionCard to manage checkbox selections
  const handleCheckboxChange = (questionId, isChecked) => {
    console.log(questionId)

    if (isChecked) {
      setSelectedQuestions(prevSelected => [...prevSelected, questionId])
    } else {
      setSelectedQuestions(prevSelected => prevSelected.filter(id => id !== questionId))
    }
  }

  // To track which questions have correct answers shown

  // Function to toggle showing the correct answer

  const handleDeleteClick = () => {
    if (selectedQuestions.length > 0) {
      setOpenDeleteDialog(true)
      setDeleteOpen(true)
      setTrashOpen(false)
    }
    // setDeleteOpen(true)
  }
  const handleResetClick = () => {
    if (selectedQuestions.length > 0) {
      setOpenDeleteDialog(true)
      setTrashOpen(true)
      setDeleteOpen(false)
    }
  }

  console.log(categories, 'categorydata')
  // Handle category selection

  const handleConfirmDelete = async () => {
    try {
      // Call the delete function from your API hook
      if (!isTrash) {
        await BulkDelete(selectedQuestions) // Assuming deleteQuestions accepts an array of IDs
      }
      if (isTrash) {
        await BulkDeleteQuestion(selectedQuestions)
      }
      console.log('Deleted questions:', selectedQuestions)
      setSelectedQuestions([]) // Clear the selected questions
      setOpenDeleteDialog(false) // Close the dialog
      fetchDataallquestion({ page: currentPage, results_per_page: rowsPerPage }) // Refresh the questions list after deletion
    } catch (error) {
      console.error('Error deleting questions:', error)
    }
  }
  const handleResetData = async () => {
    try {
      // Call the delete function from your API hook
      await resetQuestionData(selectedQuestions) // Assuming deleteQuestions accepts an array of IDs
      console.log('Deleted questions:', selectedQuestions)
      setSelectedQuestions([]) // Clear the selected questions
      setOpenDeleteDialog(false) // Close the dialog
      fetchDataallquestion({ page: currentPage, results_per_page: rowsPerPage }) // Refresh the questions list after deletion
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
  // State for toggling between active and trash data

  const questions =
    (isTrash ? trashData : allquestionData) &&
    (isTrash ? trashData : allquestionData).data
      ?.filter(item => {
        console.log(item, 'itemcheck')
        return item.question !== null
      }) // Filter based on status if isTrash is true
      .map((item, index) => ({
        guid: item?.guid,
        id: (currentPage - 1) * rowsPerPage + index + 1,
        text: item?.question, // No need for null check here since it's already filtered
        options: Array.isArray(item?.choices) ? item.choices.map(choice => choice.choice) : [], // Map the options only if choices is an array
        correctanswer: Array.isArray(item?.choices) ? item.choices.map(choice => choice.is_correct_answer) : [], // Map correct answers only iap correct answers
        marks: item?.marks,
        creationDate: item?.created_on,
        question_type: item?.question_type,
        neg_marks: item?.neg_marks,
        time: item?.time
      }))
  console.log(questions, 'questionsss')
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
  const handleStatusToggle = status => {
    setIsTrash(status === 'trash')
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

    return questions
  }
  const categoryPage = () => {
    router.push('/categories/list')
  }
  const addQuestion = () => {
    router.push('/test/questions')
  }
  const sortedQuestions = applySort(filteredQuestions)
  const parseCategories = (categories, level = 0) => {
    return categories.flatMap(category => [
      { id: category.id, title: category.title, level },
      ...parseCategories(category.children || [], level + 1)
    ])
  }
  useEffect(() => {
    if (data) {
      console.log(data, 'data12334')
      const parsedCategories = parseCategories(data)
      setCategories(parsedCategories)
    }
  }, [data])
  console.log(categories, 'categorydata')
  const [hoveredCategory, setHoveredCategory] = useState(null)

  const [clickedCategories, setClickedCategories] = useState([]) // Track which category is clicked

  const handleCategoryClick = categoryId => {
    setClickedCategories(prevClickedCategories => {
      if (prevClickedCategories.includes(categoryId)) {
        // If the category is already clicked, remove it (collapse it)
        return prevClickedCategories.filter(id => id !== categoryId)
      } else {
        // If not clicked, add it to the list of clicked categories
        return [...prevClickedCategories, categoryId]
      }
    })
  }
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Handle the toggle of the category dropdown
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }
  const handleSelectAllClick = () => {
    if (selectAll) {
      // Deselect all questions on the current page
      const currentPageQuestionIds = questions.map(question => question.guid)
      setSelectedQuestions(prevSelected => prevSelected.filter(id => !currentPageQuestionIds.includes(id)))
    } else {
      // Select all questions on the current page
      const currentPageQuestionIds = questions.map(question => question.guid)
      setSelectedQuestions(prevSelected => [...new Set([...prevSelected, ...currentPageQuestionIds])])
    }
    setSelectAll(!selectAll) // Toggle the select-all state
  }

  // Check if all questions are selected
  const isAllSelected = questions && selectedQuestions.length === questions.length

  useEffect(() => {
    if (questions && questions.map(question => selectedQuestions.includes(question.guid))) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }, [])
  console.log(selectedQuestions, 'selectedQuestion')
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  // Handle the previous page functionality
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }
  console.log(questions, 'allselected')
  return (
    <>
      <FilterHeader title='All Questions' subtitle='Orders placed across your store' link='/test/questions'>
        <Grid
          item
          xs={6}
          // gap={2}
          md={2}
          display='flex'
          alignItems='end'
          justifyContent='flex-end'
          /* Aligns the button to the right */ pb={3}
        >
          <Button
            fullWidth
            variant='contained'
            className='max-sm:is-full'
            onClick={() => setAddUserOpen(!addUserOpen)}
            startIcon={
              <i
                className='ri-add-fill'
                style={{
                  width: 21.6,
                  height: 21.6
                }}
                // onClick={e => handleDeleteClick(e, 1)}
              />
            }
          >
            Add Section
          </Button>
        </Grid>
        <Grid
          item
          xs={6}
          // gap={2}
          md={2}
          display='flex'
          alignItems='end'
          justifyContent='flex-end'
          /* Aligns the button to the right */ pb={3}
        >
          <Button
            fullWidth
            variant='contained'
            // onClick={categoryPage}
            onClick={addQuestion}
            className='max-sm:is-full'
            startIcon={
              <i
                class='ri-add-fill'
                style={{
                  width: 21.6,
                  height: 21.6
                }}
              />
            }
          >
            Add Question
          </Button>
        </Grid>
        <Grid
          item
          xs={6}
          md={2}
          display='flex'
          alignItems='end'
          justifyContent='flex-end'
          /* Aligns the button to the right */ pb={3}
        >
          <Button fullWidth variant='contained' onClick={categoryPage} className='max-sm:is-full'>
            Categories
          </Button>
        </Grid>
      </FilterHeader>
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
          handleCategoryChange={handleCategoryChange}
          handleSortChange={handleSortChange}
          onDeleteClick={handleDeleteClick}
          onResetClick={handleResetClick}
          selectedQuestions={selectedQuestions}
          deleteIconActive={deleteIconActive}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          handleCategoryClick={handleCategoryClick}
          categories={categories}
          setCategories={setCategories}
          handleDropdownToggle={handleDropdownToggle}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          trashDatalength={trashData && trashData.meta && trashData.meta.total_results}
          allquestionlength={allquestionData && allquestionData.meta && allquestionData.meta.total_results}
          // // handleCategoryChange={handleCategoryChange}
          searchKeyword={searchKeyword}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          currentPage={currentPage}
          totalPages={totalPages}
          handleSearch={e => setLocalSearch(e.target.value)}
          // searchKeyword={localSearch}
          showCorrectAnswer={showCorrectAnswer} // Pass state to Topcard
          setShowCorrectAnswer={setShowCorrectAnswer}
          showCategory={showCategory}
          setShowCategory={setShowCategory}
          setShowFields={setShowFields}
          showFields={showFields}
          clickedCategories={clickedCategories}
          setClickedCategories={setClickedCategories}
          handleCategoryTitle={handleCategoryTitle}
          handleStatusToggle={handleStatusToggle}
          trash={isTrash}
          showAllQuestion={showAllQuestion}
          handleSelectAllClick={handleSelectAllClick}
          // isDropdownOpen={isDropdownOpen}
          // setIsDropdownOpen={setIsDropdownOpen}
        />
        {/* <Sortingquestion onSortChange={handleSortChange} /> */}
        {/* <Card> */}
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
            {sortedQuestions && sortedQuestions.length > 0 ? (
              <QuestionCardBankModule
                handleSearch={handleSearch}
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                allquestion={'true'}
                currentPage={currentPage}
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
                trash={isTrash}
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
          </Grid>
        </Grid>

        <Grid item xs={12} md={12}>
          {/* <div style={{ width: '60%' }}> */} {/* Set the width to 50% */}
          {!showAll && (
            <PaginationCard
              rowsPerPage={rowsPerPage} // e.g., 10
              currentPage={currentPage} // e.g., 1
              totalPages={totalPages} // e.g., 5
              onPageChange={handlePageChange} // Your function to handle page changes
              onRowsPerPageChange={handleRowsPerPageChange} // Your function to handle rows per page change
            />
          )}
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
          {isTrash && trashOpen && (
            <DialogContentText id='alert-dialog-description'>Are you sure you want to Recover ?</DialogContentText>
          )}
          {deleteOpen && (
            <DialogContentText id='alert-dialog-description'>Are you sure you want to Delete ?</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            style={{ border: '1px solid black', color: 'black', height: '38px', width: '94px' }}
          >
            Cancel
          </Button>
          <Button
            onClick={
              isTrash && trashOpen
                ? handleResetData // For "Recover"
                : deleteOpen
                  ? handleConfirmDelete // For "Delete"
                  : null
            }
            variant='contained'
            style={{ height: '38px', width: '94px' }}
            autoFocus
          >
            {isTrash && trashOpen ? 'Restore' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      <DialogBox
        open={addUserOpen}
        onClose={() => setAddUserOpen(!addUserOpen)}
        onSubmit={onSubmit}
        description={description}
        setDescription={setDescription}
        handleSubmit={handleSubmit}
        handleReset={handleReset}
        // userData={data}
        // setData={setData}
        edit={false}
        // updateUserData={updateUserData}
        // addUserData={addUserData}
      />
      {/* </Card> */}
    </>
  )
}

export default AllQuestionList
