import dynamic from 'next/dynamic'
import React from 'react'
import { Box, Grid, List, ListItem, ListSubheader, Typography } from '@mui/material'
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from '@/libs/Recharts'

// Styled Component Imports
const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'))

const data = [
  { name: 'Incorrect Answered', value: 150, color: '#ff716d' },
  { name: 'Correct Answered', value: 100, color: '#8ee753' },
  { name: 'Unanswered', value: 110, color: '#fdc453' }
]

const RADIAN = Math.PI / 180

const renderCustomizedLabel = props => {
  // Props
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props

  // Vars
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill='#fff' textAnchor='middle' dominantBaseline='central' className='max-[400px]:text-xs'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const MyReportSummary = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <AppRecharts>
          <div className='bs-[350px]'>
            <ResponsiveContainer>
              <PieChart height={350} style={{ direction: 'ltr' }}>
                <Pie
                  data={data}
                  innerRadius={80}
                  dataKey='value'
                  label={renderCustomizedLabel}
                  labelLine={false}
                  stroke='none'
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AppRecharts>
      </Grid>

      <Grid item xs={6}>
        <Box paddingTop={10}>
          <List>
            <ListSubheader>
              <Typography variant='h5'>Total Marks: 60/100</Typography>
            </ListSubheader>
            <ListItem>
              <i className='ri-circle-fill' style={{ color: '#FDB528' }}></i>
              <Typography variant='body1'>Not Attempt</Typography>
            </ListItem>
            <ListItem>
              <i className='ri-circle-fill' style={{ color: '#FF4D49' }}></i>
              <Typography variant='body1'>Wrong</Typography>
            </ListItem>
            <ListItem>
              <i className='ri-circle-fill' style={{ color: '#72E128' }}></i>
              <Typography variant='body1'>Correct</Typography>
            </ListItem>
          </List>
        </Box>
      </Grid>
    </Grid>
  )
}

export default MyReportSummary
