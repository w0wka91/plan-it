import { Router } from "@reach/router";
import { css } from "emotion";
import React from "react";
import { Card, colors } from "react-atomicus";
import PollCreation from "./screens/PollCreation";
import PollParticipation from "./screens/PollParticipation";
import bg from "./app-bg.jpg";

const App: React.FC = () => {
  return (
    <div
      className={css`
        display: flex;
        height: 100vh;
        width: 100vw;
        align-items: center;
        justify-content: center;
      `}
    >
      <div
        className={css`
          background-image: url(${bg});
          background-size: cover;
          position: fixed;
          z-index: 1;
          display: block;
          width: 100%;
          height: 100%;
        `}
      />
      <Card
        className={css`
          border-top: 3px solid ${colors.blue500};
          z-index: 100;
        `}
      >
        <Router>
          <PollCreation path="/" />
          <PollParticipation path="/poll/:pollId" />
        </Router>
      </Card>
    </div>
  );
};

export default App;
