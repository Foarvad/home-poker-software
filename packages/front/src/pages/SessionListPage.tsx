import React, { useEffect, useState, useContext } from 'react';
import { useSocket } from '../providers/SocketProvider';
import { Layout, Header, Main } from '../components/Layout';
import { styled } from '../stitches.config';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

interface Session {
  id: string;
  name: string;
  status: string;
}

const SessionList = styled('ul', {
  listStyleType: 'none',
  padding: 0,
  width: '100%',
  maxWidth: '600px',
});

const SessionListItem = styled('li', {
  backgroundColor: '$background',
  marginBottom: '24px',
  padding: '24px',
  borderRadius: '8px',
  boxShadow: '$card',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '@media $mobile': {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  '@media $tablet': {
    flexDirection: 'row',
    alignItems: 'center',
  },
  '@media $desktop': {
    flexDirection: 'row',
    alignItems: 'center',
  },
});



export const SessionListPage: React.FC = () => {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<Session[]>([
    {id: 'uuid1', name: 'Friday night', status: 'ACTIVE'},
    {id: 'uuid2', name: 'Sunday night', status: 'NOT_STARTED'}
  ]);

  // useEffect(() => {
  //   socket.on('sessionData', (data: Session[]) => {
  //     setSessions(data);
  //   });

  //   socket.emit('getSessions');

  //   return () => {
  //     socket.off('sessionData');
  //   // };
  // }, [socket]);

  const handleJoin = (sessionId: string) => {
    navigate(`/session/${sessionId}`);
    // socket.emit('joinSession', { sessionId });
  };

  return (
    <Layout>
      <Header>Home Poker Software</Header>
      <Main>
        <SessionList>
          {sessions.map(session => (
            <SessionListItem key={session.id}>
            <div>
              <h2>Session: {session.name}</h2>
              <p>Status: {session.status}</p>
            </div>
            <Button onClick={() => handleJoin(session.id)}>Join</Button>
          </SessionListItem>
          ))}
        </SessionList>
      </Main>
    </Layout>
  );
}