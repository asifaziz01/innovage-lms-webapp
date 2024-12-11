import axios from 'axios'
import { useState } from 'react'

export default function useBookmarkQuestionsApi() {
  const [bookmark, setBookmark] = useState([])

  const fetchBookmarkData = () => {
    axios
      .get('https://669806b502f3150fb66fd477.mockapi.io/Bookmark')
      .then(response => {
        console.log('API Response:', response)

        if (response?.data && Array.isArray(response.data)) {
          setBookmark(response.data)
        } else {
          setError('No questions found in payload')
        }
      })
      .catch(error => {
        setError('Error fetching data: ' + error.message)
      })
  }

  // Update the delete function
  const deleteBookmark = async guid => {
    try {
      await axios.delete(`https://669806b502f3150fb66fd477.mockapi.io/Bookmark/${guid}`)
      fetchBookmarkData() // Refresh the data after deletion
    } catch (error) {
      console.error('Error deleting bookmark:', error)
      throw new Error('Failed to delete bookmark')
    }
  }

  return {
    bookmark,
    fetchBookmarkData,
    deleteBookmark
  }
}
