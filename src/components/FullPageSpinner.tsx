import React from "react";
import { css, keyframes } from "emotion";
import { colors } from "react-atomicus";

const FullPageSpinner: React.FC = () => {
  const bounce = keyframes`
      0%, 100% { transform: scale(0.0) }
      50% { transform: scale(1.0) }
  `;

  const doubleBounceBase = css`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: ${colors.blue700};
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    animation: ${bounce} 2s infinite ease-in-out;
  `;
  return (
    <div
      className={css`
        width: 4.8rem;
        height: 4.8rem;
        position: relative;
        margin: 100px auto;
      `}
    >
      <div
        className={css`
          ${doubleBounceBase}
        `}
      />
      <div
        className={css`
          ${doubleBounceBase}
          animation-delay: -1.0s;
        `}
      />
    </div>
  );
};

export { FullPageSpinner };
