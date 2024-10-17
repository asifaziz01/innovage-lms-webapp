'use client'
import { useEffect, useState } from 'react'

import axios from 'axios'
import { useTheme } from '@mui/material/styles'

import { toast } from 'react-toastify'
import { IconButton, Typography } from '@mui/material'

import { CATEGORY_DATA, CATEGORY_MODULE_ENDPOINTS, CATEGORY_MODULE_ENDPOINTS_CHILDREN } from '@/Const/test/ApiEndpoints'

import { alertMessages } from '@/components/globals/AlertMessages'

export default function useCategoryApi() {
  const [data, setData] = useState([])
  const theme = useTheme()

  console.info(process.env.NEXT_PUBLIC_DOCS_URL)

  const fetchData = () => {
    try {
      axios
        .post(
          `${CATEGORY_MODULE_ENDPOINTS_CHILDREN}/children`,
          {},
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        ?.then(res => {
          //   setData(res?.payload?.data)
          setData(res?.data?.payload)
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  const addCategoryData = userData => {
    console.log(userData, 'checking123')
    //userData example
    const data = {
      title: userData?.title,
      // type: userData?.type,
      details: userData?.description,
      parent_guid: userData?.category || 'null'
    }

    const formData = new FormData()

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    try {
      axios
        .post(
          `${CATEGORY_DATA}/create`,

          // userData
          formData,
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        .then(res => {
          alertMessages(theme, 'success', res?.data?.message)
          fetchData()
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }
  const viewCategory = guid => {
    // try {
    return axios.post(
      `${CATEGORY_DATA}/${guid}/view`,
      {},
      {
        Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
        Network: 'dev369',
        accept: 'application/json'
      }
    )

    // ?.then(res => {
    //   setTestData(res?.data?.payload)
    // })
    // .catch(error => {
    //   console.error('Error fetching data:', error)
    // })

    // } catch (error) {
    // console.error('Error fetching data:', error)
    // }
  }
  const updateCategoryData = (guId, data) => {
    const formData = new FormData()

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    try {
      axios.post(`${CATEGORY_DATA}/${guId}/edit`, formData).then(res => {
        alertMessages(theme, 'success', res?.data?.message)
      })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    setData,
    fetchData,
    addCategoryData,
    viewCategory,
    updateCategoryData
  }
}
