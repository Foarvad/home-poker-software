import { styled } from "../../stitches.config";

import { HoldemPokerSession, HoldemSessionStatus } from "../../types";

type SessionStatusProps = {
  pokerSession: HoldemPokerSession;
};

const Wrapper = styled("div", {
  fontSize: "48px",
});

const renderSessionStatus = (pokerSession: HoldemPokerSession) => {
  switch (pokerSession.status) {
    case HoldemSessionStatus.NOT_STARTED:
      return "Waiting to start";
    case HoldemSessionStatus.ACTIVE:
      return `Hand ${
        pokerSession.currentHand ? pokerSession.currentHand.number : "N/A"
      }`;
    case HoldemSessionStatus.ENDED:
      return "Session ended";
  }
};

export const SessionStatus: React.FC<SessionStatusProps> = ({
  pokerSession,
}) => {
  return <Wrapper>{renderSessionStatus(pokerSession)}</Wrapper>;
};
