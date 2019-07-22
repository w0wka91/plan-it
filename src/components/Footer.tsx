import React from "react";
import { colors } from "react-atomicus";
import { css } from "emotion";

const Footer: React.FC = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <div
      className={css`
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0 1.6rem;
        background: ${colors.grey100};
        height: 6.4rem;
        width: 100%;
      `}
    >
      {children}
    </div>
  );
};

export { Footer };
