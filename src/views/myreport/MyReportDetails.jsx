'use client'
import { useMemo } from 'react'
import { Card, Button, TablePagination, Typography, Box } from '@mui/material'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table'
import tableStyles from '@core/styles/table.module.css'

const MyReportDetails = () => {
  const data = [
    { question: 'What is React?', remark: 'Good', timeTaken: '5 min', marks: 10 },
    { question: 'Explain useState hook.', remark: 'Excellent', timeTaken: '10 min', marks: 15 },
    { question: 'What is JSX?', remark: 'Average', timeTaken: '7 min', marks: 8 },
    { question: 'Describe the virtual DOM.', remark: 'Good', timeTaken: '8 min', marks: 12 },
    { question: 'What is a React component?', remark: 'Satisfactory', timeTaken: '6 min', marks: 9 }
  ]

  const columnHelper = createColumnHelper()

  const columns = useMemo(
    () => [
      columnHelper.accessor('question', {
        header: 'Question',
        cell: info => info.getValue() || 'N/A'
      }),
      columnHelper.accessor('remark', {
        header: 'Remark',
        cell: info => info.getValue() || 'N/A'
      }),
      columnHelper.accessor('timeTaken', {
        header: 'Time Taken',
        cell: info => info.getValue() || 'N/A'
      }),
      columnHelper.accessor('marks', {
        header: 'Marks',
        cell: info => info.getValue() || 'N/A'
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } }
  })

  if (!data || data.length === 0) {
    return <Typography>No data available.</Typography>
  }

  return (
    <Box>
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
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={data.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      />
    </Box>
  )
}

export default MyReportDetails
