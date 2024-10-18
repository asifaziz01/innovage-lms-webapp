'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import { Accordion, AccordionSummary, Box, FormControl, Tooltip } from '@mui/material'

import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
// import { getInitials } from '../../../../../../Utils/getInitials'
// import { getLocalizedUrl } from '../../../../../../Utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import AlertDialogBox from '@/components/Common/AlertDialogBox'
import DialogBoxComponent from '@/components/Common/DialogBoxComponent'
import FilterHeader from '@/components/globals/FilterHeader'
import { getInitials } from '@/utils/getInitials'
import useDraggableList from '@/components/globals/useDraggableList'
import AttemptTestFilters from '../attempts/AttemptTestFilters'
import QuestionMarkingFilters from './QuestionMarkingFilters'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Column Definitions
const columnHelper = createColumnHelper()

const QuestionMarking = () => {
  const [rowId, setRowId] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [expandAll, setExpandAll] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // States
  const initialData = [
    {
      id: 1,

      question: 'A car covers a distance of 40 km in 24 minutesken by it to cover the same distance?',
      remark: true,
      time: 0.5,
      marks: 1,
      importance: 'high',
      difficulty: 'high',
      answers: [
        { label: '48 minutes', choice: -1 },
        { label: '36 minutes', value: 0 },
        { label: '45minutes', choice: 0 },
        { label: '23 minutes', choice: 1 }
      ]
    },
    {
      id: 2,

      question: 'ased by 40 km/hr, then what will be the time taken by it to cover the same distance?',
      remark: true,
      time: 0.5,
      marks: 1,
      importance: 'low',
      difficulty: 'high',
      answers: [
        { label: '28 minutes', choice: 0 },
        { label: '16 minutes', value: 0 },
        { label: '85minutes', choice: 0 },
        { label: '93 minutes', choice: 1 }
      ]
    },
    {
      id: 3,

      question: 'hen what will be the time taken by it to cover the same distance?',
      remark: false,
      time: 0.6,
      marks: 2,
      importance: 'high',
      difficulty: 'low'
    },
    {
      id: 4,

      question: 'sat will be the time taken by it to cover the same distance?',
      remark: true,
      time: 0.2,
      marks: 6,
      importance: 'high',
      difficulty: 'high'
    },
    {
      id: 5,

      question: ', then what will be the time taken by it to cover the same distance?',
      remark: false,
      time: 0.1,
      marks: 3,
      importance: 'low',
      difficulty: 'low'
    }
  ]

  const handleExpandAll = () => {
    setExpandAll(true)
    setExpanded(true)
  }

  const handleCollapseAll = () => {
    setExpandAll(false)
    setExpanded(false)
  }

  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState(null)

  // const [data, setData] = useState(...[tableData])
  const [data, setData] = useState(initialData)

  console.info(data)
  const [filteredData, setFilteredData] = useState(data)

  const initialColumns = ['question', 'remark', 'time', 'mark', 'action']

  const [visibleColumns, setVisibleColumns] = useState({
    question: true,
    remark: true,
    time: true,
    mark: true,
    action: true
  })

  const { items: columnOrder, handleDragOver, handleDrop, handleDragStart } = useDraggableList(initialColumns)

  // useEffect(() => {
  //   setData(tableData)
  // }, [tableData])

  // // Update marks for a specific user (identified by userId)
  // const updateMarks = (userId, newMarks) => {
  //   setData(prevData => prevData.map(row => (row.id === userId ? { ...row, marks: newMarks } : row)))
  // }

  const columns = useMemo(
    () =>
      columnOrder
        .map(columnId => {
          switch (columnId) {
            case 'question':
              return visibleColumns.question
                ? columnHelper.accessor('question', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        question
                      </Typography>
                    ),
                    cell: ({ row }) => (
                      <div className='flex items-center flex-wrap'>
                        {`${row?.original?.id}. ${row?.original?.question ?? ''}`}
                      </div>
                    )
                  })
                : null
            case 'remark':
              return visibleColumns.remark
                ? columnHelper.accessor('remark', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        remark
                      </Typography>
                    ),
                    cell: ({ row }) =>
                      row.original.remark ? (
                        <img
                          src='/images/icons/remark-check.svg'
                          alt='no_img'
                          style={{
                            width: '20px',
                            height: '20px',
                            marginRight: 10
                          }}
                        />
                      ) : (
                        <img
                          src='/images/icons/remark-close.svg'
                          alt='no_img'
                          style={{
                            width: '20px',
                            height: '20px',
                            marginRight: 10
                          }}
                        />
                      )
                  })
                : null
            case 'time':
              return visibleColumns.time
                ? columnHelper.accessor('time', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Time taken (in sec)
                      </Typography>
                    ),
                    cell: info => info.getValue()
                  })
                : null
            case 'mark':
              return visibleColumns.mark
                ? columnHelper.accessor('mark', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Mark
                      </Typography>
                    ),
                    cell: ({ row }) => (
                      <TextField
                        type='number'
                        size='small'
                        value={Number(row.original.marks)}
                        onChange={e => handleMarksChange(e, row.original.id)}
                      />
                    )
                  })
                : null
            case 'action':
              return visibleColumns.action
                ? columnHelper.accessor('action', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Action
                      </Typography>
                    ),
                    cell: ({ row }) => (
                      <Button variant='outlined' color='primary' size='small'>
                        Grade All Attempts
                      </Button>
                    )
                  })
                : null

            default:
              return null
          }
        })
        .filter(Boolean),

    [visibleColumns, columnOrder, data]
  )

  // Function to handle marks change
  const handleMarksChange = (e, id) => {
    const newMarks = e.target.value

    setExpanded(false)
    setFilteredData(oldData => oldData.map(row => (row.id === id ? { ...row, marks: Number(newMarks) } : row)))
  }

  console.info(filteredData)

  // const columns = useMemo(
  //   () => [
  //     {
  //       accessorKey: 'question',
  //       header: 'Question',
  //       cell: ({ row }) => `${row?.original?.id}. ${row?.original?.question ?? ''}`
  //     },
  //     {
  //       accessorKey: 'remark',
  //       header: 'Remark',
  //       cell: ({ row }) =>
  //         row.original.remark ? (
  //           <img
  //             src='/images/icons/remark-check.svg'
  //             alt='no_img'
  //             style={{
  //               width: '20px',
  //               height: '20px',
  //               marginRight: 10
  //             }}
  //           />
  //         ) : (
  //           <img
  //             src='/images/icons/remark-close.svg'
  //             alt='no_img'
  //             style={{
  //               width: '20px',
  //               height: '20px',
  //               marginRight: 10
  //             }}
  //           />
  //         )
  //     },
  //     {
  //       accessorKey: 'time',
  //       header: 'Time taken (in sec)',
  //       cell: info => info.getValue()
  //     },

  //     {
  //       accessorKey: 'marks',
  //       header: 'Mark',
  //       cell: ({ row }) => (
  //         <TextField
  //           type='number'
  //           size='small'
  //           value={Number(row.original.marks)}
  //           onChange={e => handleMarksChange(e, row.original.id)}
  //         />
  //       )
  //     },
  //     {
  //       accessorKey: 'action',
  //       header: 'Action',
  //       cell: ({ row }) => (
  //         <Button variant='outlined' color='primary' size='small'>
  //         Grade All Attempts
  //       </Button>
  //       )
  //     }
  //   ],
  //   []
  // )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),

    // onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const handleSearch = event => {
    const value = event.target.value

    setSearchTerm(value)

    const filtered = initialData.filter(item => item?.question?.toLowerCase().includes(value?.toLowerCase()))

    setFilteredData(filtered)
  }

  return (
    <>
      <FilterHeader title='Grading' subtitle='Math Test' />
      <Grid container xs={12} display='flex' justifyContent='space-between' pb={5}>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <TextField
              size='small'
              value={searchTerm}
              onChange={handleSearch}
              placeholder='Search Question'
              InputProps={{
                endAdornment: (
                  <i
                    class='ri-search-line'
                    style={{
                      color: '#B3B5BD'
                    }}
                  ></i>
                )
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={2.6} display='flex' justifyContent='space-between'>
          <Button color='primary' variant='outlined' onClick={handleExpandAll}>
            Expand All
          </Button>
          <Button color='primary' variant='outlined' onClick={handleCollapseAll}>
            Collapse All
          </Button>
        </Grid>
      </Grid>
      <Card>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <th
                      key={header.id}
                      draggable // Makes the column header draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      style={{ cursor: 'grab' }}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    console.info(row?.original)

                    return (
                      <>
                        <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                          {row.getVisibleCells().map(cell => (
                            <td
                              key={cell.id}
                              onClick={() => {
                                setExpandAll(false)
                                setRowId(row?.id)
                                setExpanded(!expanded)
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <Box>
                            {(expandAll ? true : rowId === row?.id) &&
                              expanded &&
                              row?.original?.answers?.map((item, index) => (
                                <Box key={row} display='flex' flexDirection='column' px={5} py={2}>
                                  <Typography
                                    color={
                                      item?.choice === -1
                                        ? 'error.main'
                                        : item?.choice === 1
                                          ? 'success.main'
                                          : 'secondary.main'
                                    }
                                  >
                                    {index === 0 ? 'a. ' : index === 1 ? 'b. ' : index === 2 ? 'c. ' : 'd. '}
                                    {item?.label}
                                  </Typography>
                                </Box>
                              ))}
                          </Box>
                        </tr>
                      </>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' }
          }}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>
    </>
  )
}

export default QuestionMarking
