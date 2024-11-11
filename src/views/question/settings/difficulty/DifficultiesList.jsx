'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import useCategoryApi from '@/api/useCategoryApi'
import DifficultiesListTable from './DifficultiesListTable'
import useDifficultiesApi from '@/api/useDifficultiesApi'

const DifficultiesList = () => {
  const {
    data,
    trashedData,
    addDifficultyData,
    trashDifficulties,
    deleteDifficulties,
    restoreTrashDifficulties,
    getTrashedDifficultiesLevel
  } = useDifficultiesApi()

  console.info(trashedData?.length)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DifficultiesListTable
          tableData={data}
          trashedData={trashedData}
          deleteDifficulties={deleteDifficulties}
          addDifficultyData={addDifficultyData}
          trashDifficulties={trashDifficulties}
          restoreTrashDifficulties={restoreTrashDifficulties}
          getTrashedDifficultiesLevel={getTrashedDifficultiesLevel}
        />
      </Grid>
    </Grid>
  )
}

export default DifficultiesList
