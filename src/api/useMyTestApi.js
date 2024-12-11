import { useState, useEffect } from 'react'
import axios from 'axios'
import { TEST_MODULE_ENDPOINTS_V2 } from '@/Const/test/ApiEndpoints'

const useMyTestApi = ({ search = '', resultPerPage = 10, page = 1, type = 'ongoing' }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const formData = new FormData()
        formData.append('search', search)
        formData.append('result_per_page', resultPerPage)
        formData.append('page', page)
        formData.append('type', type)

        const response = await axios.post(`${TEST_MODULE_ENDPOINTS_V2}/learner/enrolments/USR1`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setData(response.data.payload.data || [])
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [search, resultPerPage, page, type])

  return { data, loading, error }
}

export default useMyTestApi
