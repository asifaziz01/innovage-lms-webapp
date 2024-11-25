'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import TestListTable from './TestListTable'
import useTestApi from '@/api/test/useTestApi'

const UserList = () => {
  const {
    addTestData,
    updateTestData,
    fetchData,
    deleteTestData,
    data,
    testData,
    viewTest,
    getCategories,
    categories,
    metaData,
    searchKeyword,
    setSearchKeyword
  } = useTestApi()

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
          fetchData={fetchData}
          metaData={metaData}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
        />
      </Grid>
    </Grid>
  )
}

export default UserList
