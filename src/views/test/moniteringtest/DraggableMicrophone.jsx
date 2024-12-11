import React, { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import { Card, Box } from '@mui/material'

const DraggableMicrophone = ({ analyser }) => {
  const [micLevel, setMicLevel] = useState(1)

  useEffect(() => {
    if (analyser) {
      const updateMicLevel = () => {
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyser.getByteFrequencyData(dataArray)
        const maxVolume = Math.max(...dataArray)

        const normalizedLevel = maxVolume / 255
        setMicLevel(0.5 + normalizedLevel * 0.5)

        requestAnimationFrame(updateMicLevel)
      }
      updateMicLevel()
    }
  }, [analyser])

  return (
    <Draggable>
      <Card
        sx={{
          position: 'absolute',
          zIndex: 10,
          width: '50px',
          height: '50px',
          cursor: 'move',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
          {/* Microphone Icon */}
          <i
            className='ri-mic-fill'
            style={{
              fontSize: '1.5rem',
              opacity: micLevel,
              transition: 'opacity 0.2s'
            }}
          ></i>

          {/* Audio Level Indicator */}
          {/* <Box
            sx={{
              width: '80%',
              height: '10px',
              backgroundColor: '#f0f0f0',
              borderRadius: '5px',
              overflow: 'hidden',
              marginLeft: 1
            }}
          >
            <Box
              sx={{
                width: `${micLevel * 100}%`,
                height: '100%',
                backgroundColor: micLevel > 0.75 ? 'green' : 'orange',
                transition: 'width 0.1s'
              }}
            />
          </Box> */}
        </Box>
      </Card>
    </Draggable>
  )
}

export default DraggableMicrophone
