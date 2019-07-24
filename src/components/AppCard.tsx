import React, { PropsWithChildren } from "react";
import { Card, colors } from "react-atomicus";
import { css } from "emotion";

const AppCard: React.FC = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Card
      className={css`
        border-top: 3px solid ${colors.blue500};
      `}
    >
      {children}
    </Card>
  );
};

export { AppCard };
