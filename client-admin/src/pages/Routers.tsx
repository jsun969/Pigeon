import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import GenerateInviteCode from './GenerateInviteCode';
import FindInviteCode from './FindInviteCode';
import Login from './Login';
import Message from './Message';
import Welcome from './Welcome';

const Routers: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/invite-codes" element={<FindInviteCode />} />
        <Route path="/generate-invite-codes" element={<GenerateInviteCode />} />
        <Route path="/messages" element={<Message />} />
      </Route>
    </Routes>
  );
};

export default Routers;
