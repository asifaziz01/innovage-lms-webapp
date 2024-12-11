'use client'
import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Checkbox, TablePagination, Grid, Box, IconButton } from '@mui/material'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table'
import BookmarkQuestionsFilters from './BookmarkQuestionsFilters'
import useBookmarkQuestionsApi from '@/api/test/useBookmarkQuestionsApi' // Import the API hook
import tableStyles from '@core/styles/table.module.css'

const BookmarkQuestionsTable = () => {
  const { bookmark, fetchBookmarkData, deleteBookmark } = useBookmarkQuestionsApi() // Use the API hook
  const [testNameFilter, setTestNameFilter] = useState([]) // Initialize as an array for multi-select
  const [questionFilter, setQuestionFilter] = useState('')
  const [bookmarkDateFilter, setBookmarkDateFilter] = useState([null, null]) // Initialize as an array for date range
  const [filteredData, setFilteredData] = useState(bookmark)
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const router = useRouter()

  const formatDate = dateStr =>
    new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  useEffect(() => {
    fetchBookmarkData() // Fetch data when the component mounts
  }, [])
  const handleRowClick = questionGuid => {
    router.push(`/test/bookmarkquestions/viewquestion?guid=${questionGuid}`)
  }
  // Column definitions using React Table
  const columnHelper = createColumnHelper()

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            onClick={event => event.stopPropagation()} // Prevent row click when clicking the checkbox
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('question', {
        header: 'Question',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('test_name', {
        header: 'Test Name',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('bookmarked_on', {
        header: 'Bookmark Date',
        cell: info => formatDate(info.getValue())
      })
    ],
    []
  )

  // React Table setup
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { rowSelection, globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    initialState: { pagination: { pageSize: 10 } }
  })

  // Handle delete action
  const handleDelete = () => {
    const selectedRowIds = Object.keys(rowSelection)
      .map(id => {
        // Get the corresponding bookmark based on selected row
        const selectedBookmark = bookmark.find(item => item.id === id) // Use the row's unique ID

        return selectedBookmark ? selectedBookmark.test_guid : null // Return the test_guid if exists
      })
      .filter(guid => guid !== null) // Filter out any null values

    console.log('Selected test_guids:', selectedRowIds) // Log for debugging

    // Now delete bookmarks based on test_guid
    Promise.all(selectedRowIds.map(guid => deleteBookmark(guid)))
      .then(() => {
        fetchBookmarkData() // Fetch updated data after deletion
      })
      .catch(error => {
        console.error('Error during deletion:', error)
      })
  }

  return (
    <Card>
      <BookmarkQuestionsFilters
        bookmark={bookmark}
        setFilteredData={setFilteredData}
        testNameFilter={testNameFilter}
        setTestNameFilter={setTestNameFilter}
        questionFilter={questionFilter}
        setQuestionFilter={setQuestionFilter}
        bookmarkDateFilter={bookmarkDateFilter}
        setBookmarkDateFilter={setBookmarkDateFilter} // Pass in date range array
      />

      <Grid container item xs={12} pl={5}>
        <Grid item xs={0.9}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <IconButton
              disableRipple
              disabled={!Object.keys(rowSelection)?.length}
              sx={{
                border: `1px solid ${Object.keys(rowSelection)?.length ? '#808080' : '#E7E7E7'}`,
                borderRadius: 0
              }}
              onClick={handleDelete} // Attach the delete handler
            >
              <i
                className='ri-delete-bin-6-fill'
                color={Object.keys(rowSelection)?.length ? '#B5B8FA' : '#808080'}
                style={{
                  width: 20,
                  height: 20,
                  ...(Object.keys(rowSelection)?.length
                    ? {
                        color: '#B5B8FA'
                      }
                    : { color: '#808080' })
                }}
              ></i>
            </IconButton>
          </Box>
        </Grid>
        <Grid
          container
          pr={8}
          item
          xs={11}
          spacing={3}
          display='flex'
          alignItems='center'
          justifyContent='flex-end'
        ></Grid>
      </Grid>

      <div className='overflow-x-auto pt-5'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} onClick={() => handleRowClick(row.original.question_guid)} style={{ cursor: 'pointer' }}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component='div'
        count={filteredData.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      />
    </Card>
  )
}

export default BookmarkQuestionsTable
