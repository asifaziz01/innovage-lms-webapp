'use client'

import { Typography, Box, Divider, IconButton, Tooltip } from '@mui/material'
import useTakeTestApi from '@/api/test/useTakeTestApi'
import UserDetails from './UserDetails'

const QuestionHeader = ({
  timeLeft,
  currentQuestionNumber,
  totalQuestions,
  negativeMarking,
  questionMarks,
  test_guid,
  question_guid,
  cameraStream,
  sectionTitle
}) => {
  const { bookmarkQuestion } = useTakeTestApi()

  const handleBookmark = () => {
    bookmarkQuestion(test_guid, question_guid)
  }

  const formatTime = seconds => {
    if (seconds === null || seconds === undefined || isNaN(seconds) || seconds <= 0) {
      return null
    }

    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            padding: '8px',
            height: 32,
            borderRadius: 1,
            bgcolor: '#FFDBDB',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {mins?.toString()?.padStart(2, '0')}
        </Box>
        :
        <Box
          sx={{
            padding: '8px',
            height: 32,
            borderRadius: 1,
            bgcolor: '#FFDBDB',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {secs?.toString()?.padStart(2, '0')}
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'left',
          flexDirection: 'column',
          backgroundColor: '#fff',
          width: '100%'
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'left',
            width: '800px',
            paddingLeft: '30px',
            paddingY: '10px'
          }}
        >
          {/* Conditionally display the Question Timer */}
          {timeLeft > 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant='body1'>Question Timer:</Typography>
              {formatTime(timeLeft)}
            </Box>
          ) : (
            <a>Time out!!</a>
          )}

          <Divider orientation='vertical' flexItem sx={{ margin: '0 16px' }} />

          <Box
            sx={{
              padding: '10px',
              height: 28,
              borderRadius: 1,
              bgcolor: '#55A91E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Tooltip title='Question Marks' arrow>
              {questionMarks}
            </Tooltip>
          </Box>

          <Divider orientation='vertical' flexItem sx={{ margin: '0 16px' }} />

          <Box
            sx={{
              padding: '10px',
              height: 28,
              borderRadius: 1,
              bgcolor: '#FF4D49',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <Tooltip title='Negative Marks' arrow>
              {negativeMarking}
            </Tooltip>
          </Box>
          <Divider orientation='vertical' flexItem sx={{ margin: '0 16px' }} />
          <Tooltip title='Bookmark Question' arrow>
            <IconButton onClick={handleBookmark}>
              <i className='ri-bookmark-line' />
            </IconButton>
          </Tooltip>
          <Divider orientation='vertical' flexItem sx={{ margin: '0 16px' }} />
          <UserDetails cameraStream={cameraStream} />
        </Box>

        <Divider />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#fff',
            width: '100%'
          }}
        >
          {sectionTitle && (
            <Typography variant='h6' paddingY={6} textAlign='justify' lineHeight={1.5}>
              {sectionTitle}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  )
}

export default QuestionHeader
