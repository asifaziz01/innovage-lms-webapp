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
import { useRouter } from 'next/navigation'
import tableStyles from '@core/styles/table.module.css'

const TestTableOngoing = ({ data, type }) => {
  const router = useRouter()

  const formatDate = dateStr => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const columnHelper = createColumnHelper()

  const handleActionButtonClick = (guid, action) => {
    if (action === 'start') {
      router.push(`/instructions/generalinstructions?guid=${guid}`)
    } else if (action === 'details') {
      router.push(`/test/viewtestdetails?guid=${guid}`)
    } else if (action === 'report') {
      router.push('/myreport')
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Test Name',
        cell: info => info.getValue() || 'N/A'
      }),
      columnHelper.accessor('start_date', {
        header: 'Start Date',
        cell: info => formatDate(info.getValue())
      }),
      columnHelper.accessor('end_date', {
        header: 'End Date',
        cell: info => formatDate(info.getValue())
      }),
      columnHelper.accessor('questions', {
        header: 'Questions',
        cell: info => info.getValue() || 'N/A'
      }),
      columnHelper.accessor('duration', {
        header: 'Duration',
        cell: info => `${info.getValue() || 'N/A'} min`
      }),
      columnHelper.accessor('marks', {
        header: 'Marks',
        cell: info => info.getValue() || 'N/A'
      }),
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => {
          const test = row.original
          return (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant='contained' color='primary' onClick={() => handleActionButtonClick(test.guid, 'details')}>
                View Details
              </Button>
              {type === 'ongoing' && (
                <Button variant='contained' color='primary' onClick={() => handleActionButtonClick(test.guid, 'start')}>
                  Start Test
                </Button>
              )}
              {type === 'previous' && (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => handleActionButtonClick(test.guid, 'report')}
                >
                  View Report
                </Button>
              )}
            </Box>
          )
        }
      }
    ],
    [type]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } }
  })

  if (!data || data.length === 0) {
    return <Typography>No tests available.</Typography>
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
        rowsPerPageOptions={[10, 25, 50]}
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

export default TestTableOngoing
