'use client'

import React, { useState } from 'react'

import { useReactTable } from '@tanstack/react-table'
import { TextField, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'

// Example dummy data
const initialData = [
  { id: 1, name: 'John Doe', marks: 75 },
  { id: 2, name: 'Jane Smith', marks: 88 },
  { id: 3, name: 'Michael Lee', marks: 92 }
]

const Dummy = () => {
  // Store the table data in state
  const [data, setData] = useState(initialData)

  // Columns definition
  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: info => info.getValue()
      },
      {
        accessorKey: 'marks',
        header: 'Marks',
        cell: ({ row }) => (
          <TextField type='number' value={row.original.marks} onChange={e => handleMarksChange(e, row.original.id)} />
        )
      }
    ],
    []
  )

  // Function to handle marks change
  const handleMarksChange = (e, id) => {
    const newMarks = e.target.value

    setData(oldData => oldData.map(row => (row.id === id ? { ...row, marks: newMarks } : row)))
  }

  // Set up the table
  const table = useReactTable({
    data,
    columns
  })

  return (
    <>
      <FilterHeader title='Attempts' subtitle='Mathematics Test' />
      <Card>
        <div className='overflow-x-auto pt-5'>
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
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
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

export default Dummy
