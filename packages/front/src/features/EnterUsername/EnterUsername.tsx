import { useState } from "react";
import { styled } from "../../stitches.config";
import { Button } from "../../components/Button";

type EnterUsernameProps = {
  setUsername: (username: string) => void;
}

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  placeItems: 'center',
  gap: '16px',
});

export const EnterUsername: React.FC<EnterUsernameProps> = ({setUsername}) => {
  const recentUsername = localStorage.getItem('recentUsername');

  const [username, setUsernameState] = useState(recentUsername ?? '');

  const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameState(e.target.value);
    localStorage.setItem('recentUsername', e.target.value);
  }

  return (
    <Wrapper>
      <input type="text" value={username} onChange={handleSubmit}></input>
      <Button onClick={() => setUsername(username)}>Join session</Button>
    </Wrapper>
  )
}
