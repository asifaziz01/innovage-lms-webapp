'use client'
import { useEffect, useState } from 'react'
import { ApiRequestHandle } from '@/libs/axios'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { file } from 'valibot'
// import { USER_MODULE_ENDPOINTS } from '../Const/ApiEndpoints'

export default function useQuestionModuleApi() {
  const [data, setData] = useState([])
  const [file, setFiles] = useState([])
  const router = useRouter()
  const [loader, setLoader] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadData, setUploadData] = useState([]) // Fix typo here
  const [allquestionData, setallquestionData] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const fetchData = async () => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL}tests/questions/eng2` // Construct the full URL

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`, // Add Authorization header
          Network: process.env.NEXT_PUBLIC_LMS_TOKEN, // Add Network header
          Accept: 'application/json' // Specify the accepted response format
        }
      })
      setLoader(false)
      setData(response.data?.payload) // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  console.log(data, 'check123')
  const uploadFiles = async files => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('userfile', file)
      console.log(file, 'eeeee')
    })
    setFiles(files)
    try {
      setUploading(true)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_LMS_API_URL}qb/questions/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`,
          Network: process.env.NEXT_PUBLIC_LMS_TOKEN
        }
      })
      setUploadData(response.data.payload.questions) // Make sure this works
      console.log(response.data.payload.questions, 'uuu')
      console.log(uploadData, 'uuu2')
    } catch (error) {
      console.error('Error uploading files:', error)
      alert('Failed to upload files. Please try again.')
    } finally {
      setUploading(false)
    }
  }
  const fetchDataallquestion = async (searchTerm = '') => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL}qb/questions/list` // Construct the full URL
      const formData = new FormData()
      formData.append('search', searchTerm) // Add the search term to the formData
      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`, // Add Authorization header
          Network: process.env.NEXT_PUBLIC_LMS_TOKEN, // Add Network header
          Accept: 'application/json' // Specify the accepted response format
        }
      })
      setLoader(false)
      setallquestionData(response.data?.payload) // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    console.log(uploadData, 'updated uploadData')
  }, [uploadData, file])
  // Optional: Use useEffect to watch for changes in uploadData
  // useEffect(() => {
  //   if (uploadData.length > 0) {
  //     console.log('Updated UploadData:', uploadData)
  //   }
  //   uploadFiles()
  // }, [uploadData])

  // Optional: Use useEffect to watch for changes in uploadData
  // useEffect(() => {
  //   if (uploadData.length > 0) {
  //     console.log('Updated UploadData:', uploadData)
  //   }
  // }, [uploadData])
  // useEffect(() => {
  //   if (uploadData.length > 0) {
  //     console.log('UploadData:', uploadData)
  //   }
  // }, [uploadData])

  return {
    data,
    setData,
    fetchData,
    loader,
    setLoader,
    uploadFiles,
    uploading,
    uploadData,
    setUploadData,
    file,
    setFiles,
    fetchDataallquestion,
    allquestionData,
    setallquestionData,
    searchKeyword,
    setSearchKeyword
  }
}
