'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Card, Grid, Typography, Box, Button, FormControlLabel, Checkbox } from '@mui/material'
import DraggableCamera from './DraggableCamera'
import DraggableMicrophone from './DraggableMicrophone'
import FilterHeader from '@/components/globals/FilterHeader'

const TestMedia = () => {
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

  useEffect(() => {
    if (!recording && chunks.current.length > 0) {
      const blob = new Blob(chunks.current, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'recording.webm'
      link.click()
      chunks.current = []
    }
  }, [recording])

  const startCapture = async () => {
    try {
      let combinedStream = new MediaStream()

      // Screen Capture
      if (captureScreen) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        screenVideoRef.current.srcObject = stream
        setScreenStream(stream)
        stream.getTracks().forEach(track => combinedStream.addTrack(track))
      }

      // Camera Capture
      if (captureCamera) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        setCameraStream(stream)
        stream.getTracks().forEach(track => combinedStream.addTrack(track))
      }

      // Audio Capture
      if (captureAudio) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
        analyserRef.current = audioContextRef.current.createAnalyser()
        const source = audioContextRef.current.createMediaStreamSource(stream)
        source.connect(analyserRef.current)
        analyserRef.current.connect(audioContextRef.current.destination)
        setAudioStream(stream)
        stream.getTracks().forEach(track => combinedStream.addTrack(track))
      }

      // Start MediaRecorder
      if (combinedStream.getTracks().length > 0) {
        mediaRecorderRef.current = new MediaRecorder(combinedStream)
        mediaRecorderRef.current.ondataavailable = event => {
          if (event.data.size > 0) {
            chunks.current.push(event.data)
          }
        }
        mediaRecorderRef.current.start()
        setRecording(true)
      } else {
        console.error('No media sources selected.')
      }
    } catch (error) {
      console.error('Error starting capture:', error)
    }
  }

  const stopCapture = () => {
    // Stop MediaRecorder
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }

    // Stop Camera Stream
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }

    // Stop Screen Stream
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop())
      setScreenStream(null)
    }

    // Stop Audio Stream
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop())
      setAudioStream(null)
    }
  }

  return (
    <>
      <FilterHeader title='System Checks'></FilterHeader>
      <Card sx={{ padding: 8, minHeight: '600px' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} textAlign='center'>
            <Typography variant='h5'>Select the components to test before starting the exam:</Typography>
          </Grid>
          <Grid item xs={12} textAlign='center'>
            <FormControlLabel
              control={<Checkbox checked={captureScreen} onChange={e => setCaptureScreen(e.target.checked)} />}
              label='Screen'
            />
            <FormControlLabel
              control={<Checkbox checked={captureCamera} onChange={e => setCaptureCamera(e.target.checked)} />}
              label='Camera'
            />
            <FormControlLabel
              control={<Checkbox checked={captureAudio} onChange={e => setCaptureAudio(e.target.checked)} />}
              label='Audio'
            />
          </Grid>

          {/* Screen Capture */}
          {captureScreen && (
            <Grid item xs={6}>
              <Typography variant='body1' textAlign='center'>
                Screen
              </Typography>
              <Card>
                <video ref={screenVideoRef} autoPlay playsInline style={{ width: '100%' }} />
              </Card>
            </Grid>
          )}

          {/* Camera Capture */}
          {captureCamera && <DraggableCamera videoRef={cameraVideoRef} stream={cameraStream} />}

          {/* Audio Monitor */}
          {captureAudio && analyserRef.current && <DraggableMicrophone analyser={analyserRef.current} />}

          {/* Start/Stop Buttons */}
          <Grid item xs={6} textAlign='right'>
            <Button variant='contained' color='primary' onClick={startCapture} disabled={recording}>
              Start
            </Button>
          </Grid>
          <Grid item xs={6} textAlign='left'>
            <Button variant='contained' color='secondary' onClick={stopCapture} disabled={!recording}>
              Stop
            </Button>
          </Grid>
        </Grid>
      </Card>
    </>
  )
}

export default TestMedia
