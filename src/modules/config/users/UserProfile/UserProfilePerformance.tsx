import React from 'react';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import UserProfileLayout from './UserProfileLayout';

export default function UserProfilePerformance() {
  const { profileId } = useParams();
  return (
    <UserProfileLayout>
      <Box>
        <Box>UserProfilePerformance {profileId}</Box>
      </Box>
    </UserProfileLayout>
  );
}
