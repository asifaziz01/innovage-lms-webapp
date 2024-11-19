'use client'
import { useEffect, useState } from 'react'

import axios from 'axios'
import { useTheme } from '@mui/material/styles'

import { toast } from 'react-toastify'
import 'react-toastify/ReactToastify.min.css'
import { IconButton, Typography } from '@mui/material'

import moment from 'moment'

import { USER_MODULE_ENDPOINTS } from '@/Const/test/ApiEndpoints'
import { alertMessages } from '@/components/globals/AlertMessages'

export default function useTestApi() {
  const [data, setData] = useState([])
  const [submissionsData, setSubmissionsData] = useState([])
  const [categories, setCategories] = useState([])
  const [testData, setTestData] = useState({})
  const theme = useTheme()

  console.info(process.env.NEXT_PUBLIC_DOCS_URL)

  const fetchData = () => {
    try {
      axios
        .post(
          `${USER_MODULE_ENDPOINTS}/list`,
          {},
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        ?.then(res => {
          setData(res?.data?.payload?.data)
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getCategories = () => {
    try {
      axios
        .post(
          `${USER_MODULE_ENDPOINTS}/categories`,
          {},
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        ?.then(res => {
          setCategories(res?.data?.payload)
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const viewTest = guid => {
    // try {
    return axios.get(
      `${USER_MODULE_ENDPOINTS}/view/${guid}`,
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

  useEffect(() => {
    fetchData()
  }, [])

  const addTestData = userData => {
    //userData example
    const data = {
      title: userData?.title,
      type: userData?.type,
      details: userData?.description,
      category: userData?.category
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
          `${USER_MODULE_ENDPOINTS}/add`,

          // userData
          formData,
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        .then(res => {
          fetchData()
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const testSettings = (guid, settingsData) => {
    //userData example
    const data = {
      // marks_per_question: 1,
      // neg_marks_per_question: 0,
      // pass_marks: 30,
      // pass_marks_unit: 'percentage',
      // time_per_question: 0,
      // test_duration: 0,
      // show_timer: false,
      // show_result: 'immediately',
      // on_date: '01-12-2023 15:25:00',
      // num_attempts: 0,
      // show_question_hint_on_test_page: 0,
      // randomize_questions_within_test: 1,
      // randomize_answer_choices: 1,
      // randomize_questions_within_comprehension: 0,
      // allow_bookmark_questions: 1,
      // show_bookmark_question_correct_answer: 0
      ...settingsData

      //randomize_fixed_answer_choices:0
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
          `${USER_MODULE_ENDPOINTS}/settings/${guid}`,

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

  const testSubmissions = (data, sessionId) => {
    //userData example
    const datas = {
      guid: data?.guid,
      attempted_start_date: data?.startDate ? moment(data?.startDate).format('DD-MM-yyyy') : null,
      attempted_end_date: data?.endDate ? moment(data?.endDate).format('DD-MM-yyyy') : null,
      submission_start_date: data?.submissionStartDate ? moment(data?.submissionStartDate).format('DD-MM-yyyy') : null,
      submission_end_date: data?.submissionEndDate ? moment(data?.submissionEndDate).format('DD-MM-yyyy') : null

      // session_id: sessionId
    }

    const formData = new FormData()

    if (typeof datas === 'object') {
      Object.entries(datas).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    try {
      axios
        .post(
          `${USER_MODULE_ENDPOINTS}/submissions`,

          // userData
          formData,
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        .then(res => {
          setSubmissionsData(res?.data?.payload)
          alertMessages(theme, 'success', res?.data?.message)
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updateTestData = (guId, data) => {
    const formData = new FormData()

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    try {
      axios.post(`${USER_MODULE_ENDPOINTS}/add/${guId}`, formData).then(res => {})

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteTestData = userId => {
    try {
      return axios.delete(`${USER_MODULE_ENDPOINTS}/delete/${userId}`).then(() => fetchData())
    } catch (error) {}
  }

  const handleTestPublish = (guid, publishKey) => {
    //userData example
    const formData = new FormData()

    formData.append('status', publishKey)

    try {
      axios
        .post(
          `${USER_MODULE_ENDPOINTS}/status/${guid}`,

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

  return {
    deleteTestData,
    updateTestData,
    addTestData,
    data,
    setData,
    testData,
    viewTest,
    getCategories,
    categories,
    handleTestPublish,
    testSettings,
    testSubmissions,
    submissionsData
  }
}
