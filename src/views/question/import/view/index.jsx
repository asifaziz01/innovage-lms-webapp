'use client'

import React, { useState, useEffect } from 'react'
import QuestionCard from '../../list/QuestionCard'
// import useQuestionApi from '../../../Api/useQuestionApi'
import { Box, CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'
import TableFilters from '../../list/TableFilters'
import Tablefor from './Tablefor'
import useQuestionModuleApi from '@/api/useQuestionModuleApi'
import EditImport from '../../list/EditImport'
const ImportView = () => {
  const [expandedPanels, setExpandedPanels] = useState([]) // Tracks which panels are expanded
  const [isVisible, setIsVisible] = useState(true) // Controls visibility of questions
  const [showAnswers, setShowAnswers] = useState([]) // Tracks which panels' answers are shown
  const [edit, setEdit] = useState(false)
  const [isExpandedAll, setIsExpandedAll] = useState(false) // Tracks if all are expanded
  const { uploadData, uploadFiles, file, uploadingData, uploadFiled } = useQuestionModuleApi()
  const [fileReferences, setFileReferences] = useState([])
  const { files, uploading, error } = useSelector(state => state.fileReducer)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [questions, setQuestions] = useState([])
  console.log(files, 'ccccc')
  console.log(uploadData, 'ssssss')
  const createFileArray = fileList => {
    return Array.from(fileList).map(file => ({
      path: file.name,
      name: file.name,
      lastModified: file.lastModified,
      lastModifiedDate: new Date(file.lastModified),
      size: file.size,
      type: file.type,
      webkitRelativePath: file.webkitRelativePath || ''
    }))
  }
  console.log(files, 'chedcking')
  // Simulated file input (e.g., coming from an <input type="file"> or drag-and-drop)
  const fileList = [
    new File(['file content'], 'BulkQuestionUpload.txt', {
      type: 'text/plain',
      lastModified: 1726239009248
    })
  ]
  useEffect(() => {
    if (files.length > 0) {
      uploadFiles(files) // Call the API with the files if they exist
    }
  }, [files])
  console.log(files, 'filesarray')
  console.log(uploadData)
  useEffect(() => {
    if (uploadData) {
      const formattedQuestions = Object.keys(uploadData)
        .filter(key => uploadData[key].question !== null)
        .map((key, index) => {
          const item = uploadData[key]
          const { choice, is_correct_answer, question, parent_id, created_by, order, type, guid } = item
          return {
            guid: guid,
            id: index + 1,
            text: question,
            options: choice || [],
            correctanswer: is_correct_answer,
            order,
            created_by,
            parent_id,
            type
          }
        })
      setQuestions(formattedQuestions)
    }
  }, [uploadData])
  console.log(questions, 'questionscheck')
  const filesArray = createFileArray(fileList)
  console.log(createFileArray(fileList), 'hhhh')

  console.log(fileReferences, 'files')
  useEffect(() => {
    // uploadFiles(filesArray)
  }, [])
  // const handleExpandAllButton = () => {
  //   setIsVisible(true) // Show the questions
  //   setExpandedPanels(questions.map(q => q.id)) // Expand all panels
  //   setShowAnswers(questions.map(q => q.id)) // Reset showing answers (no answers shown)
  //   // setIsExpandedAll(true) // Set the expanded state
  // }
  // Function to collapse all accordions and hide everything
  const handleCollapseAll = () => {
    setExpandedPanels([]) // Collapse all panels
    setIsVisible(false) // Hide the questions
    setShowAnswers([]) // Reset answers visibility
    setIsExpandedAll(false) // Reset the expanded state
  }

  // Function to toggle the answer visibility of a specific question
  const toggleAnswer = panelId => {
    setIsVisible(true)
    if (showAnswers.includes(panelId)) {
      setShowAnswers(showAnswers.filter(id => id !== panelId)) // Hide answer if already visible
    } else {
      setShowAnswers([...showAnswers, panelId]) // Show answer if hidden
      setIsVisible(true)
    }
  }
  const [filteredData, setFilteredData] = useState(uploadData || []) // Initialize with data from API

  // const { uploadData } = useQuestionApi(); // Fetching uploadData from the hook
  const handleSave = updatedQuestion => {
    setQuestions(prevQuestions =>
      prevQuestions.map(question => (question.id === updatedQuestion.id ? updatedQuestion : question))
    )
    setEditingQuestion(null) // Close the EditImport component
  }

  useEffect(() => {
    if (uploadData) {
      setFilteredData(uploadData) // Make sure uploadData is set here
    }
  }, [uploadData])
  // console.log(uploadData, 'checking')

  // const questions = uploadData
  //   ?.filter(item => item.question !== null) // Filter out items with a null question
  //   .map((item, index) => {
  //     // For each item in questionsArray
  //     if (item.options) {
  //       // For multiple-choice questions, convert correctAnswer to [1, 0, 0, 0] format
  //       const correctAnswerIndex = item.options.indexOf(item.correctAnswer)
  //       const updatedCorrectAnswer = item.options.map((_, idx) => (idx === correctAnswerIndex ? '1' : '0'))

  //       return {
  //         id: index + 1,
  //         text: item.question,
  //         options: item.options,
  //         correctanswer: updatedCorrectAnswer // Use the updated correct answer format
  //       }
  //     }

  //     return {
  //       id: index + 1,
  //       text: item.question,
  //       options: item.options,
  //       correctanswer: item.correctAnswer
  //     }
  //   })

  const questionss = Object.keys(uploadData)
    .filter(key => uploadData[key].question !== null) // Filter out items with a null question
    .map((key, index) => {
      const item = uploadData[key]

      // Extract the values from each question object
      const { choice, correct_answer, question, parent_id, created_by, order, question_type, guid } = item

      // If choices exist (i.e., a multiple-choice question)
      if (choice) {
        return {
          guid: guid,
          id: index + 1,
          text: question,
          options: choice, // Use 'choice' for options
          correctanswer: correct_answer, // Use 'correct_answer' from the object
          order, // Optionally include order if needed
          created_by, // Include the created_by field
          parent_id, // Include the parent_id field
          question_type // Include the question_type field (e.g., "mcq", "mcma")
        }
      }

      // For other question types that may not have choices
      return {
        guid: guid,
        id: index + 1,
        text: question,
        correctanswer: correct_answer,
        parent_id,
        created_by,
        question_type
      }
    })
  console.log(questions, 'questioncheck')
  // console.log(questionss, 'questionss')
  const [selectedQuestions, setSelectedQuestions] = useState([]) // Track selected checkboxes in QuestionCard
  // console.log(questions, 'questions')
  // Pass this to QuestionCard to manage checkbox selections
  const handleCheckboxChange = (questionId, isChecked) => {
    if (isChecked) {
      setSelectedQuestions([...selectedQuestions, questionId]) // Add question to selected list
    } else {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId)) // Remove from list
    }
  }
  // const handleCancelDelete = () => {
  //   setUserToDelete(null)
  //   setOpen(false)
  // }
  // const handleConfirmDelete = () => {
  //   // setData(data?.filter(product => product.id !== userToDelete))
  //   // setUserToDelete(null)
  //   // setOpen(false)
  // }
  // const handleExpandAll = () => {
  //   setIsVisible(true) // Show the questions
  //   setExpandedPanels(questions.map(q => q.id)) // Expand all panels
  //   setShowAnswers([]) // Reset showing answers (no answers shown)
  //   setIsExpandedAll(true) // Set the expanded state
  // }
  const handleDeleteClick = () => {
    if (selectedQuestions.length > 0) {
      setOpenDeleteDialog(true)
    }
  }
  const handleExpandAll = () => {
    setIsVisible(true) // Show the questions
    setExpandedPanels(questionss.map(q => q.id)) // Expand all panels
    setShowAnswers([]) // Reset showing answers (no answers shown)
    setIsExpandedAll(true) // Set the expanded state
  }
  const handleEditClick = question => {
    setEditingQuestion(question) // Set the selected question to be edited
  }

  // Function to reset editing state
  const resetEditing = () => {
    setEditingQuestion(null)
  }
  // const handleEditClick = question => {
  //   setEditingQuestion(question)
  // }

  const width = '100%'
  const marginLeft = '0px'
  return (
    <>
      {/* <Tablefor /> */}
      {questions.length > 0 && !editingQuestion && (
        <QuestionCard
          check={'true'}
          onEditClick={handleEditClick}
          marginLeft={marginLeft}
          width={width}
          expandedPanels={expandedPanels}
          setExpandedPanels={setExpandedPanels}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          showAnswers={showAnswers}
          setShowAnswers={setShowAnswers}
          handleCollapseAll={handleCollapseAll}
          handleExpandAll={handleExpandAll}
          toggleAnswer={toggleAnswer}
          questions={questions}
          isExpandedAll={isExpandedAll}
          setIsExpandedAll={setIsExpandedAll}
          onQuestionSelect={handleCheckboxChange}
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
          edit={edit}
          setEdit={setEdit}
        />
      )}
      {editingQuestion && <EditImport question={editingQuestion} onSave={handleSave} />}
      {/* // ) : ( //{' '}
      <>
        //{' '}
        <Box className='loader' style={{ textAlign: 'center', padding: '50px 0px' }}>
          // <CircularProgress />
          //{' '}
        </Box>
        //{' '}
      </> */}
    </>
  )
}

export default ImportView
