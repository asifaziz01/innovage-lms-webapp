'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Vars
const series = [
  {
    name: 'Earning',
    data: [120, 200, 150, 120]
  },
  {
    name: 'Expense',
    data: [72, 120, 50, 65]
  },
  {
    name: 'All',
    data: [72, 120, 50, 65]
  }
]

const BarChart = () => {
  // Hooks
  const theme = useTheme()

  // Vars
  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    grid: {
      yaxis: {
        lines: { show: false }
      }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main],
    plotOptions: {
      bar: {
        borderRadius: 0,
        columnWidth: '48%',
        borderRadiusApplication: 'end'
      }
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      labels: { show: true },
      axisTicks: { show: false },
      axisBorder: { show: true },
      categories: ['Jan', 'Feb', 'Mar', 'Apr']
    },

    yaxis: {
      labels: { show: true },
      axisBorder: { show: true },
      axisTicks: { show: false }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.xl,
        options: {
          plotOptions: {
            bar: { columnWidth: '60%' }
          }
        }
      },
      {
        breakpoint: 1310,
        options: {
          plotOptions: {
            bar: { borderRadius: 0 }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          plotOptions: {
            bar: { columnWidth: '45%' }
          }
        }
      },
      {
        breakpoint: 735,
        options: {
          plotOptions: {
            bar: { columnWidth: '50%', marginRight: '20px' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: { columnWidth: '38%' }
          }
        }
      },
      {
        breakpoint: 450,
        options: {
          plotOptions: {
            bar: { columnWidth: '50%' }
          }
        }
      }
    ]
  }

  return (
    <AppReactApexCharts
      type='bar'
      height='100%'
      width='100%'
      boxWidth='40vw'
      boxHeight='40vh'
      options={options}
      series={series}
    />
  )
}

export default BarChart
