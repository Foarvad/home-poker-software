import { Layout, Header, Main } from '../components/Layout';
import { EnterUsername } from '../features/EnterUsername';
import { styled } from '../stitches.config';
import { useParams } from 'react-router-dom';

const JoinButton = styled('button', {
  backgroundColor: '$buttonBg',
  color: '$buttonText',
  fontSize: '24px',
  padding: '8px 24px',
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
    marginTop: '8px',
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

type SessionPageContentProps = {
  sessionId?: string;
}

const SessionPageContent: React.FC<SessionPageContentProps> = ({sessionId}) => {
  const usernameLocalStorageKey = `username-${sessionId}`;

  const username = localStorage.getItem(usernameLocalStorageKey);

  const setUsername = (username: string) => {
    localStorage.setItem(usernameLocalStorageKey, username);
  }

  // use routing because localstorage does not cause rerender

  if (!username) {
    return <EnterUsername setUsername={setUsername} />
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