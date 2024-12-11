// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { USER_MODULE_ENDPOINTS } from '@/Const/test/ApiEndpoints'

// export default function useTakeTestApi() {
//   const [test, setTest] = useState([])
//   const [questions, setQuestions] = useState([]) // questions from the payload
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [sessionKey, setSessionKey] = useState('') // session key

//   let sessionId
//   const generateSessionKey = () => {
//     return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
//   }

//   sessionId = generateSessionKey()
//   localStorage.setItem('session', sessionId)

//   const createSession = async guid => {
//     const formData = new FormData()
//     formData.append('user_guid', 'ASH12') // Manually set for now
//     formData.append('set_session', localStorage.getItem('session'))

//     try {
//       const response = await axios.post(`${USER_MODULE_ENDPOINTS}/take_test/${guid}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       })

//       if (response.status === 200) {
//         toast.success('Test-Session created successfully!')
//         return sessionId
//       } else {
//         toast.error('Failed to create session.')
//         return null
//       }
//     } catch (error) {
//       toast.error('Error creating Test session: ' + error.message)
//       return null
//     }
//   }

//   // Fetch all test questions data by GUID
//   const fetchData = guid => {
//     if (!guid) return
//     setLoading(true)
//     try {
//       axios
//         .get(`${USER_MODULE_ENDPOINTS}/questions/${guid}`)
//         .then(res => {
//           if (res?.data?.payload && Array.isArray(res.data.payload)) {
//             setQuestions(res.data.payload) //questions from the payload
//           } else {
//             setError('No questions found in payload')
//           }
//           setLoading(false)
//         })
//         .catch(error => {
//           setError('Error fetching data: ' + error.message)
//           setLoading(false)
//         })
//     } catch (error) {
//       setError('Error: ' + error.message)
//       setLoading(false)
//     }
//   }

//   // Fetch Test Data by guid
//   const fetchTestData = async guid => {
//     if (!guid) return
//     setLoading(true)

//     try {
//       const res = await axios.get(`${USER_MODULE_ENDPOINTS}/view/${guid}`)
//       if (res?.data?.payload) {
//         setTest(res.data.payload) // Set the test data directly from the payload object
//       } else {
//         setError('No test found in payload')
//       }
//     } catch (error) {
//       setError('Error fetching data: ' + error.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Submit test data (selected answers and time taken)
//   const submitTest = async (guid, selectedOptions, timeTaken) => {
//     const formData = new FormData()
//     formData.append('user_guid', 'ASH12')
//     formData.append('set_session', localStorage.getItem('session'))

//     Object.keys(selectedOptions).forEach(questionIndex => {
//       const questionGuid = questions[questionIndex]?.guid
//       const selectedChoice = selectedOptions[questionIndex]
//       const timeSpent = timeTaken[questionGuid] || 0

//       if (questionGuid && selectedChoice) {
//         formData.append(`answer[${questionGuid}]`, selectedChoice)
//         formData.append(`time_taken[${questionGuid}]`, timeSpent)
//       }
//     })

//     try {
//       const response = await axios.post(`${USER_MODULE_ENDPOINTS}/submit_test/${guid}`, formData)
//       if (response.status === 200) {
//         toast.success('Test submitted successfully!')
//       } else {
//         toast.error('Failed to submit the test.')
//       }
//     } catch (error) {
//       toast.error('Error submitting the test: ' + error.message)
//     }
//   }

//   // Bookmark question
//   const bookmarkQuestion = async (testGuid, questionGuid) => {
//     const formData = new FormData()
//     formData.append('test_guid', testGuid)
//     formData.append('question_guid', questionGuid)

//     try {
//       const response = await axios.post(`${USER_MODULE_ENDPOINTS}/bookmark/add`, formData)
//       if (response.status === 200) {
//         toast.success('Question bookmarked successfully!')
//       } else {
//         toast.error('Failed to bookmark the question.')
//       }
//     } catch (error) {
//       toast.error('Error bookmarking the question: ' + error.message)
//     }
//   }

//   return {
//     test,
//     questions,
//     loading,
//     error,
//     sessionKey,
//     createSession,
//     fetchData,
//     submitTest,
//     fetchTestData,
//     bookmarkQuestion // Expose the new function
//   }
// }

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { TEST_MODULE_ENDPOINTS_V2, USER_MODULE_ENDPOINTS } from '@/Const/test/ApiEndpoints'
import { alertMessages } from '@/components/globals/AlertMessages'
import { useTheme } from '@mui/material/styles'

export default function useTakeTestApi() {
  const [test, setTest] = useState([])
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sessionKey, setSessionKey] = useState('')
  const theme = useTheme()
  const [testQuestions, setTestQuestions] = useState([])

  let sessionId
  // useEffect(() => {
  //   setSessionKey(sessionId)
  // }, [sessionId])
  // generate random session key
  const generateSessionKey = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  sessionId = generateSessionKey()

  // Create session key and post request for session
  const createSession = async guid => {
    // setSessionKey(sessionId)

    // alert(sessionKey)

    // Create a FormData object to send the data

    localStorage.setItem('session', sessionId)

    const formData = new FormData()

    formData.append('session_guid', localStorage.getItem('session'))

    try {
      const response = await axios.post(`${TEST_MODULE_ENDPOINTS_V2}/${guid}/learner/take_test`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 200) {
        // toast.success('Test-Session created successfully!')
        alertMessages(theme, 'success', 'Test Started')
        return sessionId
      } else {
        alertMessages(theme, 'error', 'Something went wrong')
        return null
      }
    } catch (error) {
      toast.error('Error creating Test session: ' + error.message)
      alertMessages(theme, 'success', res.data.message)
      return null
    }
  }

  // Fetch all test questions data by GUID
  const fetchData = guid => {
    if (!guid) return
    setLoading(true)
    try {
      axios
        .get(`${USER_MODULE_ENDPOINTS}/questions/${guid}`)
        .then(res => {
          if (res?.data?.payload && Array.isArray(res.data.payload)) {
            setQuestions(res.data.payload) //questions from the payload
          } else {
            setError('No questions found in payload')
          }
          setLoading(false)
        })
        .catch(error => {
          setError('Error fetching data: ' + error.message)
          setLoading(false)
        })
    } catch (error) {
      setError('Error: ' + error.message)
      setLoading(false)
    }
  }

  //fetch All questions of a Test V2

  const fetchTestQuestions = async guid => {
    if (!guid) return
    setLoading(true)
    try {
      const endpoint = `${TEST_MODULE_ENDPOINTS_V2}/${guid}/questions/all`

      const response = await axios.post(endpoint, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`, // Add Authorization header
          Network: process.env.NEXT_PUBLIC_LMS_TOKEN, // Add Network header
          Accept: 'application/json' // Specify the accepted response format
        }
      })

      setLoading(false)
      setTestQuestions(response.data?.payload) // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  //fetch Test Data by guid

  const fetchTestData = async guid => {
    if (!guid) return

    setLoading(true)

    try {
      const res = await axios.get(`${USER_MODULE_ENDPOINTS}/view/${guid}`)

      if (res?.data?.payload) {
        setTest(res.data.payload)
      } else {
        setError('No test found in payload')
      }
    } catch (error) {
      setError('Error fetching data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Submit test data (selected answers and time taken)
  const submitTest = async (guid, selectedOptions, timeTaken) => {
    const formData = new FormData()
    alert('hello')
    console.log(timeTaken, 'Time')
    // Append the session key
    formData.append('user_guid', 'ASH12')
    formData.append('set_session', localStorage.getItem('session'))
    // Use the generated session key

    // Create a FormData object to send the data

    Object.keys(selectedOptions).forEach(questionIndex => {
      const questionGuid = questions[questionIndex]?.guid
      const selectedChoice = selectedOptions[questionIndex]
      const timeSpent = timeTaken[questionGuid] || 0

      if (questionGuid && selectedChoice) {
        formData.append(`answer[${questionGuid}]`, selectedChoice)
        formData.append(`time_taken[${questionGuid}]`, timeSpent)
      }
    })

    try {
      const response = await axios.post(`${USER_MODULE_ENDPOINTS}/submit_test/${guid}`, formData)
      if (response.status === 200) {
        toast.success('Test submitted successfully!')
      } else {
        toast.error('Failed to submit the test.')
      }
    } catch (error) {
      toast.error('Error submitting the test: ' + error.message)
    }
  }

  const bookmarkQuestion = async (testGuid, questionGuid) => {
    const formData = new FormData()
    formData.append('test_guid', testGuid)
    formData.append('question_guid', questionGuid)

    try {
      const response = await axios.post(`${USER_MODULE_ENDPOINTS}/bookmark/add`, formData)
      if (response.status === 200) {
        toast.success('Question bookmarked successfully!')
      } else {
        toast.error('Failed to bookmark the question.')
      }
    } catch (error) {
      toast.error('Error bookmarking the question: ' + error.message)
    }
  }

  return {
    test,
    questions,
    loading,
    error,
    sessionKey,
    testQuestions,
    setTestQuestions,
    createSession,
    fetchData,
    submitTest,
    fetchTestData,
    bookmarkQuestion,
    fetchTestQuestions
  }
}
