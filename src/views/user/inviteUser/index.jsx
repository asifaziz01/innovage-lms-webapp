import { useState } from 'react'

import { Typography, Grid } from '@mui/material'

import InviteCard from './inviteCard'
import PendingUsers from './pendingUser'
import UploadInviteDialog from './UploadInvite'
import FilterHeader from '@/Components/globals/FilterHeader'

const InviteUser = () => {
  const [pendingUsers, setPendingUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])

  const handleInvite = newUser => {
    setPendingUsers([...pendingUsers, newUser])
  }

  const handleDelete = (email = null) => {
    if (email) {
      const remainingUsers = pendingUsers.filter(user => user.email !== email)

      setPendingUsers(remainingUsers)
    } else {
      const remainingUsers = pendingUsers.filter(user => !selectedUsers.includes(user.email))

      setPendingUsers(remainingUsers)
      setSelectedUsers([])
    }
  }

  const handleResend = email => {
    console.log(`Resend invite to: ${email}`)
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex is-full flex-wrap justify-start flex-col items-center sm:flex-row sm:justify-between sm:items-center gap-5'>
        <FilterHeader title='Invite User'>
          <Grid item xs={6} md={2} display='flex' alignItems='center' pb={3}>
            <UploadInviteDialog />
          </Grid>
        </FilterHeader>
      </div>

      <InviteCard onInvite={handleInvite} />
      <PendingUsers
        pendingUsers={pendingUsers}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        onDelete={handleDelete}
        onResend={handleResend}
      />
    </div>
  )
}

export default InviteUser
