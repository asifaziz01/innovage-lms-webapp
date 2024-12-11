'use client'
import React, { useState, useEffect, useRef } from 'react'
import GeneralInstructions from '../instructions/GeneralInstructions'
import TestInstructions from '../instructions/TestInstructions'
import TakeTest from '../taketest/TakeTest'
import DraggableCamera from '../moniteringtest/DraggableCamera'
import DraggableMicrophone from '../moniteringtest/DraggableMicrophone'
import { useRouter, useSearchParams } from 'next/navigation'
import useTakeTestApi from '@/api/test/useTakeTestApi'
import { createPortal } from 'react-dom'

const TestPortal = () => {
  const [currentPage, setCurrentPage] = useState('general') // 'general', 'testInstructions', 'takeTest'
  const [mediaAccessGranted, setMediaAccessGranted] = useState(false)
  const [recordingData, setRecordingData] = useState(null)

  const handleNext = () => setCurrentPage('testInstructions')
  const handleBack = () => setCurrentPage('general')

  const handleRecordingComplete = data => setRecordingData(data)

  const grantMediaAccess = () => {
    // Logic to request camera/mic/screen permissions
    setMediaAccessGranted(true)
  }

  const searchParams = useSearchParams()
  const router = useRouter()
  const guid = searchParams.get('guid')
  const { createSession } = useTakeTestApi()

  const handleBeginTest = async () => {
    const sessionId = await createSession(guid) // Create session
    if (sessionId) {
      setCurrentPage('takeTest')
      // Redirect to the test page with session ID
    }
  }

  const [recording, setRecording] = useState(false)
  const [captureAudio, setCaptureAudio] = useState(false)
  const [captureCamera, setCaptureCamera] = useState(false)
  const [captureScreen, setCaptureScreen] = useState(false)

  const [cameraStream, setCameraStream] = useState(null)
  const [screenStream, setScreenStream] = useState(null)
  const [audioStream, setAudioStream] = useState(null)

  const screenVideoRef = useRef(null)
  const cameraVideoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const chunks = useRef([])

  const startCapture = async () => {
    try {
      let combinedStream = new MediaStream()

      // Screen Capture
      if (captureScreen) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        setScreenStream(screenStream)
        screenStream.getTracks().forEach(track => combinedStream.addTrack(track))
      }

      // Camera Capture
      if (captureCamera) {
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true })
        setCameraStream(cameraStream)
        cameraStream.getTracks().forEach(track => combinedStream.addTrack(track))
      }

      // Audio Capture
      if (captureAudio) {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setAudioStream(audioStream)
        audioStream.getTracks().forEach(track => combinedStream.addTrack(track))

        // Create AnalyserNode for mic visualization
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
        analyserRef.current = audioContextRef.current.createAnalyser()
        const audioSource = audioContextRef.current.createMediaStreamSource(audioStream)
        audioSource.connect(analyserRef.current)
      }

      if (combinedStream.getTracks().length === 0) {
        console.error('No tracks available in combined stream.')
        return
      }

      // Start MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(combinedStream)
      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          chunks.current.push(event.data)
        }
      }
      mediaRecorderRef.current.start()
      setRecording(true)

      setMediaAccessGranted(true)
    } catch (error) {
      console.error('Error starting capture:', error)
    }
  }

  const stopCapture = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = () => {
        if (chunks.current.length > 0) {
          const blob = new Blob(chunks.current, { type: 'video/webm' })
          const url = URL.createObjectURL(blob)

          // Trigger file download
          const link = document.createElement('a')
          link.href = url
          link.download = 'recording.webm'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          // Clear chunks for future recordings
          chunks.current = []
        }
      }

      mediaRecorderRef.current.stop()
    }

    // Stop all active streams
    if (cameraStream) cameraStream.getTracks().forEach(track => track.stop())
    if (screenStream) screenStream.getTracks().forEach(track => track.stop())
    if (audioStream) audioStream.getTracks().forEach(track => track.stop())

    setCameraStream(null)
    setScreenStream(null)
    setAudioStream(null)

    // Update state
    setRecording(false)
  }

  const handleChange = () => {
    setCaptureAudio(e.target.checked)
    setCaptureCamera(e.target.checked)
    setCaptureScreen(e.target.checked)
  }
  return (
    <>
      {currentPage === 'general' && <GeneralInstructions onNext={handleNext} />}
      {currentPage === 'testInstructions' && (
        <TestInstructions
          captureScreen={captureScreen}
          captureAudio={captureAudio}
          captureCamera={captureCamera}
          handleBeginTest={handleBeginTest}
          handleChange={e => {
            const { name, checked } = e.target
            if (name === 'captureAudio') setCaptureAudio(checked)
            if (name === 'captureCamera') setCaptureCamera(checked)
            if (name === 'captureScreen') setCaptureScreen(checked)
          }}
          onAllow={() => {
            grantMediaAccess()
            startCapture() // Trigger media capture once access is granted
          }}
        />
      )}
      {currentPage === 'takeTest' && (
        <TakeTest
          mediaAccessGranted={mediaAccessGranted}
          onSubmit={() => {
            handleRecordingComplete()
            stopCapture() // Trigger media capture once access is granted
          }}
        />
      )}
      {mediaAccessGranted &&
        createPortal(
          <>
            {captureCamera && <DraggableCamera videoRef={cameraVideoRef} stream={cameraStream} />}
            {captureAudio && <DraggableMicrophone analyser={analyserRef.current} />}
          </>,
          document.body // Render outside the main layout
        )}
    </>
  )
}

export default TestPortal
