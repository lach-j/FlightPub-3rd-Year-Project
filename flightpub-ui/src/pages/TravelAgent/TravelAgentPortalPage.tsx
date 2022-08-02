import { Box } from '@chakra-ui/react';
import { Outlet, Route, Routes, useParams } from 'react-router-dom';

export const TravelAgentPortalPage = () => {
  return (
    <>
      <h1>hello?</h1>
    </>
  );
};

export const TestComponent = () => {
  const { id } = useParams();

  return <Box>{id}</Box>;
};
