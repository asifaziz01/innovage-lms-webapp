'use client'

import { useRef, useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import CustomAvatar from '@core/components/mui/Avatar'
import themeConfig from '@configs/themeConfig'
import { useSettings } from '@core/hooks/useSettings'
import { getInitials } from '@/utils/getInitials'
import axios from 'axios'

const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return <div className='overflow-x-hidden bs-full'>{children}</div>
  } else {
    return (
      <PerfectScrollbar className='bs-full' options={{ wheelPropagation: false, suppressScrollX: true }}>
        {children}
      </PerfectScrollbar>
    )
  }
}

const getAvatar = params => {
  const { avatarImage, avatarIcon, avatarText, title, avatarColor, avatarSkin } = params

  if (avatarImage) {
    return <Avatar src={avatarImage} />
  } else if (avatarIcon) {
    return (
      <CustomAvatar color={avatarColor} skin={avatarSkin || 'light-static'}>
        <i className={avatarIcon} />
      </CustomAvatar>
    )
  } else {
    return (
      <CustomAvatar color={avatarColor} skin={avatarSkin || 'light-static'}>
        {avatarText || getInitials(title)}
      </CustomAvatar>
    )
  }
}

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])

  const anchorRef = useRef(null)
  const ref = useRef(null)

  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const { settings } = useSettings()

  const handleClose = () => {
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleReadNotification = (event, value, index) => {
    event.stopPropagation()
    const newNotifications = [...notifications]
    newNotifications[index].read = value
    setNotifications(newNotifications)
  }

  const handleRemoveNotification = (event, index) => {
    event.stopPropagation()
    const newNotifications = [...notifications]
    newNotifications.splice(index, 1)
    setNotifications(newNotifications)
  }

  const readAllNotifications = () => {
    const newNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }))
    setNotifications(newNotifications)
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('https://669806b502f3150fb66fd477.mockapi.io/UserList')
        const fetchedNotifications = response.data.map(notification => ({
          ...notification,
          time: new Date(notification.date).toLocaleString(), // Format the date
          read: false // Default to unread
        }))
        setNotifications(fetchedNotifications)
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    fetchNotifications()

    const adjustPopoverHeight = () => {
      if (ref.current) {
        const availableHeight = window.innerHeight - 100
        ref.current.style.height = `${Math.min(availableHeight, 550)}px`
      }
    }

    window.addEventListener('resize', adjustPopoverHeight)
  }, [])

  const notificationCount = notifications.filter(notification => !notification.read).length
  const readAll = notifications.every(notification => notification.read)

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle} className='text-textPrimary'>
        <Badge
          color='error'
          className='cursor-pointer'
          variant='dot'
          overlap='circular'
          invisible={notificationCount === 0}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <i className='ri-notification-2-line' />
        </Badge>
      </IconButton>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        ref={ref}
        anchorEl={anchorRef.current}
        {...(isSmallScreen
          ? {
              className: 'is-full !mbs-4 z-[1] max-bs-[550px] bs-[550px]',
              modifiers: [
                {
                  name: 'preventOverflow',
                  options: {
                    padding: themeConfig.layoutPadding
                  }
                }
              ]
            }
          : { className: 'is-96 !mbs-4 z-[1] max-bs-[550px] bs-[550px]' })}
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
            <Paper className={classnames('bs-full', settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg')}>
              <ClickAwayListener onClickAway={handleClose}>
                <div className='bs-full flex flex-col'>
                  <div className='flex items-center justify-between plb-3 pli-4 is-full gap-2'>
                    <Typography variant='h6' className='flex-auto'>
                      Notifications
                    </Typography>
                    {notificationCount > 0 && (
                      <Chip variant='tonal' size='small' color='primary' label={`${notificationCount} New`} />
                    )}
                    <Tooltip
                      title={readAll ? 'Mark all as unread' : 'Mark all as read'}
                      placement={placement === 'bottom-end' ? 'left' : 'right'}
                      slotProps={{
                        popper: {
                          sx: {
                            '& .MuiTooltip-tooltip': {
                              transformOrigin:
                                placement === 'bottom-end' ? 'right center !important' : 'right center !important'
                            }
                          }
                        }
                      }}
                    >
                      {notifications.length > 0 ? (
                        <IconButton size='small' onClick={readAllNotifications} className='text-textPrimary'>
                          <i className={classnames(readAll ? 'ri-mail-line' : 'ri-mail-open-line', 'text-xl')} />
                        </IconButton>
                      ) : null}
                    </Tooltip>
                  </div>
                  <Divider />
                  <ScrollWrapper hidden={hidden}>
                    {notifications.map((notification, index) => {
                      const { title, subtitle, time, read, avatarImage, avatarIcon, avatarText, avatarColor, avatarSkin } =
                        notification

                      return (
                        <div
                          key={index}
                          className={classnames('flex plb-3 pli-4 gap-3 cursor-pointer hover:bg-actionHover group', {
                            'border-be': index !== notifications.length - 1
                          })}
                          onClick={e => handleReadNotification(e, true, index)}
                        >
                          {getAvatar({ avatarImage, avatarIcon, title, avatarText, avatarColor, avatarSkin })}
                          <div className='flex flex-col flex-auto'>
                            <Typography variant='body2' className='font-medium mbe-1' color='text.primary'>
                              {title}
                            </Typography>
                            <Typography variant='caption' className='mbe-2' color='text.secondary'>
                              {subtitle}
                            </Typography>
                            <Typography variant='caption' color='text.disabled'>
                              {time}
                            </Typography>
                          </div>
                          <div className='flex flex-col items-end gap-2'>
                            <Badge
                              variant='dot'
                              color={read ? 'secondary' : 'primary'}
                              onClick={e => handleReadNotification(e, !read, index)}
                              className={classnames('mbs-1 mie-1', {
                                'invisible group-hover:visible': read
                              })}
                            />
                            <i
                              className='ri-close-line text-xl invisible group-hover:visible text-textSecondary'
                              onClick={e => handleRemoveNotification(e, index)}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </ScrollWrapper>
                  <Divider />
                  <div className='p-4'>
                    <Button fullWidth variant='contained' size='small'>
                      View All Notifications
                    </Button>
                  </div>
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default NotificationDropdown
