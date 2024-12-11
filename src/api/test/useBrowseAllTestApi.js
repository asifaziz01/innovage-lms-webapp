import { useState, useEffect } from 'react'
import axios from 'axios'
import { TEST_MODULE_ENDPOINTS_V2, USER_MODULE_ENDPOINTS } from '@/Const/test/ApiEndpoints'

export default function useBrowseAllTestApi() {
  const [allTestData, setAllTestData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAllTestData = async () => {
    setLoading(true)
    try {
      const endpoint = `${TEST_MODULE_ENDPOINTS_V2}/learner/all`

      const response = await axios.post(endpoint, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`, // Add Authorization header
          Network: process.env.NEXT_PUBLIC_LMS_TOKEN, // Add Network header
          Accept: 'application/json' // Specify the accepted response format
        }
      })

      setLoading(false)
      setAllTestData(response.data?.payload) // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return {
    allTestData,

    loading,
    error,
    fetchAllTestData
  }
}
