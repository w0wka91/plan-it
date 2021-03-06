import React from "react";
import { css, cx } from "emotion";
import { colors } from "react-atomicus";
import { mq } from "../media-queries";

interface Props {
  className?: string;
}
const Heading = ({ children, className }: React.PropsWithChildren<Props>) => {
  return (
    <h1
      className={cx(
        css`
          color: ${colors.grey700};
          padding-bottom: 3.2rem;
          font-style: italic;
          font-weight: 400;
          ${mq[0]} {
            text-align: center;
          }
        `,
        className
      )}
    >
      {children}
    </h1>
  );
};

export default Heading;
