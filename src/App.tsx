import { Router } from "@reach/router";
import { css } from "emotion";
import React from "react";
import { colors } from "react-atomicus";
import bg from "./app-bg.jpg";
import PollCreation from "./screens/PollCreation";
import PollParticipation from "./screens/PollParticipation";

const App: React.FC = () => {
  return (
    <>
      <h1
        className={css`
          font-family: "Dancing Script", cursive;
          font-size: 4.8rem;
          color: ${colors.blue700};
          position: absolute;
          top: 4.8rem;
          right: 4.8rem;
          z-index: 1000;
        `}
      >
        Plan it!
      </h1>
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
            z-index: -1;
            display: block;
            width: 100%;
            height: 100%;
          `}
        />
        <Router>
          <PollCreation default path="/" />
          <PollParticipation path="/poll/:pollId" />
        </Router>
      </div>
    </>
  );
};

export default App;
