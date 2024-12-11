import React, { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import { Card, Box } from '@mui/material'

const DraggableCamera = ({ videoRef, stream }) => {
  const [minimized, setMinimized] = useState(false)
  const [position, setPosition] = useState(null) // Initialize as null

  const toggleSize = () => setMinimized(prev => !prev)

  // Function to calculate bottom-right position
  const calculateDefaultPosition = () => ({
    x: window.innerWidth - 200, // Adjust based on your desired offset
    y: window.innerHeight - 150
  })

  useEffect(() => {
    setPosition(calculateDefaultPosition()) // Set initial position

    const handleResize = () => {
      setPosition(calculateDefaultPosition()) // Recalculate position on resize
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream, videoRef])

  // Render only after position is calculated
  if (!position) return null

  return (
    <Draggable defaultPosition={position} bounds='parent'>
      <Card
        onClick={toggleSize}
        sx={{
          position: 'absolute',
          zIndex: 9999,
          width: minimized ? '150px' : '180px',
          height: minimized ? '90px' : '120px',
          cursor: 'pointer',
          overflow: 'hidden',
          transition: 'all 0.1s ease-in-out'
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%'
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>
      </Card>
    </Draggable>
  )
}

export default DraggableCamera
