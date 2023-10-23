import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Layout, Header, Main } from '../components/Layout';
import { EnterUsername } from '../features/EnterUsername';

type SessionPageContentProps = {
  sessionId?: string;
}

const SessionPageContent: React.FC<SessionPageContentProps> = ({sessionId}) => {
  const usernameLocalStorageKey = `username-${sessionId}`;

  const [username, setUsername] = useState(localStorage.getItem(usernameLocalStorageKey));

  const handleSetUsername = (username: string) => {
    setUsername(username);
    localStorage.setItem(usernameLocalStorageKey, username);
  }

  if (!username) {
    return <EnterUsername setUsername={handleSetUsername} />
  }

  return <>Welcome {username}!</>
}

export const SessionPage: React.FC = () => {
  const { sessionId } = useParams<{sessionId: string}>();
  // useEffect(() => {
  //   socket.on('sessionData', (data: Session[]) => {
  //     setSessions(data);
  //   });

  //   socket.emit('getSessions');

  //   return () => {
  //     socket.off('sessionData');
  //   // };
  // }, [socket]);


  return (
    <Layout>
      <Header>Poker Session {sessionId}</Header>
      <Main>
        <SessionPageContent sessionId={sessionId} />
      </Main>
    </Layout>
  );
}