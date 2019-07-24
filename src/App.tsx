import { Router } from "@reach/router";
import { css } from "emotion";
import React from "react";
import { colors } from "react-atomicus";
import bg from "./app-bg.jpg";
import PollCreation from "./screens/PollCreation";
import PollParticipation from "./screens/PollParticipation";
import { mq } from "./media-queries";

const App: React.FC = () => {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
        background-image: url(${bg});
        background-size: cover;
      `}
    >
      <h1
        className={css`
          font-family: "Dancing Script", cursive;
          font-size: 4.8rem;
          color: ${colors.blue700};
          padding: 4.8rem;
          align-self: flex-end;
          ${mq[0]} {
            align-self: center;
          }
        `}
      >
        Plan it!
      </h1>
      <div
        className={css`
          flex-grow: 1;
          display: flex;
          align-items: stretch;
          justify-content: center;
          ${mq[0]} {
            display: block;
          }
        `}
      >
        <Router>
          <PollCreation default path="/" />
          <PollParticipation path="/poll/:pollId" />
        </Router>
      </div>
    </div>
  );
};

export default App;
