'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function useTakeTestApi() {
  const [data, setData] = useState([])
  const [testData, setTestData] = useState({})

  // Mock API base URL
  const API_BASE_URL = 'https://669806b502f3150fb66fd477.mockapi.io'

  // Fetch all test data
  const fetchData = () => {
    try {
      axios
        .get(`${API_BASE_URL}/TakeTest`)
        .then(res => {
          setData(res?.data) // Setting the fetched data
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // View specific test data by GUID
  const viewTest = guid => {
    try {
      return axios
        .get(`${API_BASE_URL}/TakeTest/${guid}`)
        .then(res => {
          setTestData(res?.data) // Setting specific test data
        })
        .catch(error => {
          console.error('Error fetching test data:', error)
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Add new test data
  const addTestData = testData => {
    try {
      axios
        .post(`${API_BASE_URL}/TakeTest`, testData)
        .then(res => {
          toast.success('Test added successfully!')
          fetchData() // Refreshing the data after adding
        })
        .catch(error => {
          console.error('Error adding test data:', error)
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Update existing test data by GUID
  const updateTestData = (guId, updatedData) => {
    try {
      axios
        .put(`${API_BASE_URL}/TakeTest/${guId}`, updatedData)
        .then(res => {
          toast.success('Test updated successfully!')
          fetchData() // Refreshing the data after updating
        })
        .catch(error => {
          console.error('Error updating test data:', error)
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Delete test data by ID
  const deleteTestData = testId => {
    try {
      axios
        .delete(`${API_BASE_URL}/TakeTest/${testId}`)
        .then(() => {
          toast.success('Test deleted successfully!')
          fetchData() // Refreshing the data after deletion
        })
        .catch(error => {
          console.error('Error deleting test data:', error)
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    fetchData() // Fetch all test data on initial render
  }, [])

  return {
    data,
    testData,
    fetchData,
    viewTest,
    addTestData,
    updateTestData,
    deleteTestData
  }
}
