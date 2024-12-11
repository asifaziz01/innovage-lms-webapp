'use client'
import { Card, CardContent, Grid } from '@mui/material'
import CustomTabList from '@core/components/mui/TabList'
import BarChart from './difficulty/BarChart'
import DifficultyReport from './difficulty/DifficultyReport'
import DifficultyReportTable from './difficulty/DifficultyReportTable'
const MyReportDifficulty = () => {
  return (
    <Card>
      <CardContent sx={{ padding: 4 }}>
        <Grid container xs={12}>
          <Grid item lg={6} md={12}>
            <BarChart />
          </Grid>
          <Grid item lg={6} md={12}>
            <DifficultyReport />
          </Grid>
        </Grid>
        <Grid container xs={12} marginTop={4}>
          <Grid item xs={12}>
            <DifficultyReportTable />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default MyReportDifficulty
