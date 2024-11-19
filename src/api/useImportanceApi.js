'use client'
import { useState } from 'react'
const [importanceData, setImportanceData] = useState([])
const fetchImportanceData = searchKeyword => {
  const formData = new FormData()

  if (searchKeyword) {
    formData.append('search', searchKeyword) // Add the search term to the formData
  }

  try {
    axios
      .post(`${process.env.NEXT_PUBLIC_BASEPATH_V2}qb/importance/all`, formData, {
        Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
        Network: 'dev369',
        accept: 'application/json'
      })
      ?.then(res => {
        setImportanceData(res?.data?.payload?.data)
      })
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
return {
  importanceData,
  fetchImportanceData
}
