import { Box, Typography, Divider } from '@mui/material'
import React, { useRef, useEffect } from 'react'

const UserDetails = ({ cameraStream }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream
    }
  }, [cameraStream])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Camera Feed Box */}
        <Box
          sx={{
            height: '60px',
            width: '100px',
            border: '1px solid black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000'
          }}
        >
          {cameraStream ? (
            <video ref={videoRef} autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
          ) : (
            'Camera feed'
          )}
        </Box>
      </Box>
      <Divider />
    </>
  )
}

export default UserDetails
