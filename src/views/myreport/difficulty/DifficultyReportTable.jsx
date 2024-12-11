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

const DifficultyReportTable = () => {
  const data = [
    { difficulty: 'High', score: '60', classAverage: '60', highScore: '80' },
    { difficulty: 'High', score: '60', classAverage: '60', highScore: '80' },
    { difficulty: 'High', score: '60', classAverage: '60', highScore: '80' }
  ]

  const columnHelper = createColumnHelper()

  const columns = useMemo(
    () => [
      columnHelper.accessor('difficulty', {
        header: 'Difficulty Level',
        cell: info => info.getValue() || 'N/A'
      }),
      columnHelper.accessor('score', {
        header: 'Score',
        cell: info => info.getValue() || 'N/A'
      }),
      columnHelper.accessor('classAverage', {
        header: 'Class Average',
        cell: info => info.getValue() || 'N/A'
      }),
      columnHelper.accessor('highScore', {
        header: 'High Score',
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
    <Box border={'1px solid #D3D3D3'}>
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

export default DifficultyReportTable
