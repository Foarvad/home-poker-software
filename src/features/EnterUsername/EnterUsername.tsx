import { useState } from "react";

import { Button } from "../../components/Button";
import { CenterWrapper } from "../../components/Layout";
import { TextInput } from "../../components/TextInput";

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
    <CenterWrapper>
      <TextInput
        label="Your name"
        type="text"
        value={username}
        onChange={(e) => setUsernameState(e.target.value)}
      ></TextInput>
      <Button onClick={handleSubmit}>Join session</Button>
    </CenterWrapper>
  );
};
