'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import React, { useEffect, useState } from 'react'
// Component Imports
import TestListTable from './TestListTable'

import useCategoryApi from '@/api/useCategoryApi'

const CategoriesList = () => {
  const { data, addCategoryData, trashCategoryData, trashData, trashDifficultyData, resetCategoryData } =
    useCategoryApi()
  const [tableData, setTableData] = useState(data)
  const [trashView, setTrashView] = useState(false)
  useEffect(() => {
    setTableData(data) // Set initial data on load
  }, [data])

  useEffect(() => {
    if (trashData) {
      setTableData(trashData) // Set trash data when it changes
    }
  }, [trashData])

  // Handler for the trash button click
  const handleTrashClick = () => {
    trashDifficultyData() // Call the API to fetch trash data
    setTrashView(true)
  }
  console.log(trashView, 'checking')
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}>
        <UserListCards />
      </Grid> */}
      <Grid item xs={12}>
        <TestListTable
          tableData={tableData}
          addCategoryData={addCategoryData}
          trashCategoryData={trashCategoryData}
          handleTrashClick={handleTrashClick}
          trashView={trashView}
          resetCategoryData={resetCategoryData}
        />
      </Grid>
    </Grid>
  )
}

export default CategoriesList
