import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { TEST_MODULE_ENDPOINTS_V2, USER_MODULE_ENDPOINTS } from '@/Const/test/ApiEndpoints'
import { alertMessages } from '@/components/globals/AlertMessages'
import { useTheme } from '@mui/material/styles'

export default function useViewSingleTestApi() {
  const [testDetails, setTestDetails] = useState([])
  const [error, setError] = useState(null)

  const [loading, setLoading] = useState(true)

  const theme = useTheme()

  const fetchTestDetails = async guid => {
    if (!guid) return
    setLoading(true)
    try {
      const endpoint = `${TEST_MODULE_ENDPOINTS_V2}/${guid}/view`

      const response = await axios.post(endpoint, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`, // Add Authorization header
          Network: process.env.NEXT_PUBLIC_LMS_TOKEN, // Add Network header
          Accept: 'application/json' // Specify the accepted response format
        }
      })

      setLoading(false)
      setTestDetails(response.data?.payload) // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return {
    testDetails,

    loading,
    error,
    fetchTestDetails
  }
}
