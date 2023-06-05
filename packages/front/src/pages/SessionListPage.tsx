import React, { useEffect, useState, useContext } from 'react';
import { useSocket } from '../providers/SocketProvider';
import { Layout, Header, Main } from '../components/Layout';
import { styled } from '../stitches.config';

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
  marginBottom: '$7',
  padding: '$7',
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

const JoinButton = styled('button', {
  backgroundColor: '$buttonBg',
  color: '$buttonText',
  padding: '$4 $7',
  borderRadius: '8px',
  boxShadow: '$button',
  border: 'none',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:active': {
    backgroundColor: '#004085',
  },
  '@media $mobile': {
    marginTop: '$4',
    alignSelf: 'flex-end',
  },
  '@media $tablet': {
    marginTop: '0',
    alignSelf: 'center',
  },
  '@media $desktop': {
    marginTop: '0',
    alignSelf: 'center',
  },
});

export function SessionListPage () {
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
    // socket.emit('joinSession', { sessionId });
  };

  return (
    <Layout>
      <Header>Poker Sessions</Header>
      <Main>
        <SessionList>
          {sessions.map(session => (
            <SessionListItem key={session.id}>
            <div>
              <h2>Session: {session.name}</h2>
              <p>Status: {session.status}</p>
            </div>
            <JoinButton onClick={() => handleJoin(session.id)}>Join</JoinButton>
          </SessionListItem>
          ))}
        </SessionList>
      </Main>
    </Layout>
  );
}