import { Card, CardActions, CardContent, Grid, Typography, Button, Switch, FormControlLabel } from '@mui/material'

const QuestionsSection = ({ title, subtitle, dummyData, children, settings }) => {
  // const dummyData = [
  //   {
  //     icon: '/images/icons/badge.svg',
  //     title: 'All Questions'
  //   },
  //   {
  //     icon: '/images/icons/preview.svg',
  //     title: 'Preview Test'
  //   },
  //   {
  //     icon: '/images/icons/import.svg',
  //     title: 'Import Questions'
  //   },
  //   {
  //     icon: '/images/icons/test.svg',
  //     title: 'Take test as student'
  //   },
  //   {
  //     icon: '/images/icons/add.svg',
  //     title: 'Add Questions'
  //   }
  // ]

  return (
    <Grid item xs={12} md={6}>
      <Card
        sx={{
          ...(dummyData?.length >= 3 && {
            minHeight: '50vh'
          })
        }}
      >
        <CardContent>
          <Grid container xs={12} spacing={2}>
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: 18
                }}
              >
                {title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>{subtitle}</Typography>
            </Grid>
            <Grid item container xs={12}>
              {dummyData?.map(item => (
                <>
                  <Grid
                    key={item}
                    item
                    xs={settings ? (item?.title === 'Publish' ? 6 : 12) : 6}
                    display='flex'
                    alignItems='center'
                    p={2}
                  >
                    <img
                      src={item?.icon}
                      alt='no_img'
                      style={{
                        width: '30px',
                        height: '30px',
                        marginRight: 10
                      }}
                    />
                    {/* <span onClick={() => item?.handleClick()}> */}
                    <Typography
                      component='a'
                      target='_blank'
                      rel='noopener noreferrer'
                      style={{ textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }} // Optional: to style the link
                      onClick={() => item?.handleClick()}
                    >
                      {item?.title}
                    </Typography>
                    {/* </span> */}
                  </Grid>
                  {item?.component}
                </>
              ))}
            </Grid>
            <Grid item container xs={12} spacing={3} mt={4}>
              {children}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Grid>
  )
}

export default QuestionsSection
