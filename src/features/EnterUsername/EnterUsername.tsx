import { useState } from "react";

import { Button } from "../../components/Button";
import { Main } from "../../components/Layout";

type EnterUsernameProps = {
  setUsername: (username: string) => void;
};

export const EnterUsername: React.FC<EnterUsernameProps> = ({
  setUsername,
}) => {
  // recentUsername is used to prefill name field
  const recentUsername = localStorage.getItem("recentUsername");

  const [username, setUsernameState] = useState(recentUsername ?? "");

  const handleSubmit = () => {
    localStorage.setItem("recentUsername", username);
    setUsername(username);
  };

  return (
    <Main>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsernameState(e.target.value)}
      ></input>
      <Button onClick={handleSubmit}>Join session</Button>
    </Main>
  );
};
