'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import TestListTable from './TestListTable'
import useTestApi from '@/api/useTestApi'

const UserList = () => {
  const { addTestData, updateTestData, deleteTestData, data, testData, viewTest, getCategories, categories } =
    useTestApi()

  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}>
        <UserListCards />
      </Grid> */}
      <Grid item xs={12}>
        <TestListTable
          tableData={data}
          addUserData={addTestData}
          deleteUserData={deleteTestData}
          categories={categories}
          getCategories={getCategories}
        />
      </Grid>
    </Grid>
  )
}

export default UserList
