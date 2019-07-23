import { RouteComponentProps } from "@reach/router";
import { css } from "emotion";
import React, { useReducer } from "react";
import { Button, Checkbox, colors, Icon, Input } from "react-atomicus";
import { Footer } from "../components/Footer";
import Heading from "../components/Heading";
import { useFirebase } from "../context/firebase-context";
import { usePoll } from "../hooks/usePoll";
import { useVotes } from "../hooks/useVotes";
import { Center } from "../components/Center";

interface Props {
  pollId: string;
}

interface Vote {
  participantName: string;
  selectedOptions: Date[];
}

type State = {
  vote: Vote;
};

type Action =
  | { type: "change-participant-name"; name: string }
  | { type: "add-option"; date: Date }
  | { type: "remove-option"; date: Date }
  | { type: "reset-input-fields" };

const reducer: React.Reducer<State, Action> = (
  prevState: State,
  action: Action
) => {
  switch (action.type) {
    case "change-participant-name":
      return {
        ...prevState,
        vote: { ...prevState.vote, participantName: action.name }
      };
    case "add-option":
      return {
        ...prevState,
        vote: {
          ...prevState.vote,
          selectedOptions: [...prevState.vote.selectedOptions, action.date]
        }
      };
    case "remove-option":
      return {
        ...prevState,
        vote: {
          ...prevState.vote,
          selectedOptions: prevState.vote.selectedOptions.filter(
            opt => opt.getTime() !== action.date.getTime()
          )
        }
      };
    case "reset-input-fields":
      return {
        vote: { participantName: "", selectedOptions: [] }
      };
    default:
      return prevState;
  }
};

const PollParticipation: React.FC<RouteComponentProps<Props>> = ({
  pollId
}: RouteComponentProps<Props>) => {
  const { db } = useFirebase();
  const poll = usePoll(pollId);
  const [state, dispatch] = useReducer(reducer, {
    vote: { participantName: "", selectedOptions: [] }
  });

  const vote = () => {
    dispatch({ type: "reset-input-fields" });

    db.collection("polls")
      .doc(pollId)
      .collection("votes")
      .add({
        ...state.vote,
        creationDate: new Date()
      });
  };

  const isVoteBtnActive =
    state.vote.participantName.trim() !== "" &&
    state.vote.selectedOptions.length > 0;

  const tableBorder = css`
    border: 1px solid ${colors.grey200};
  `;
  return (
    <form
      onSubmit={ev => {
        ev.preventDefault();
      }}
    >
      <div
        className={css`
          display: flex;
          padding: 6.4rem;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 51.2rem;
          min-height: 38.4rem;
        `}
      >
        {poll && (
          <>
            <Heading
              className={css`
                padding-bottom: 0rem;
              `}
            >
              {poll.title}
            </Heading>
            <h2
              className={css`
                font-size: 1.5rem;
                font-weight: 400;
                color: ${colors.grey600};
              `}
            >
              Created by {poll.creator.name}
            </h2>
            <Center
              className={css`
                width: 100%;
                padding-top: 4.8rem;
              `}
            >
              <table
                className={css`
                  border-collapse: collapse;
                  ${tableBorder}
                  td, th {
                    ${tableBorder}
                  }
                  td {
                    padding: 1.2rem;
                  }
                `}
              >
                <TableHeader poll={poll} />
                <tbody>
                  <Votes poll={poll} />
                  <tr>
                    <td>
                      <Input
                        type="text"
                        autoComplete="off"
                        placeholder="Your name"
                        value={state.vote.participantName}
                        onChange={evt =>
                          dispatch({
                            type: "change-participant-name",
                            name: evt.currentTarget.value
                          })
                        }
                      />
                    </td>
                    {poll.options.map(opt => (
                      <td key={opt.getTime()}>
                        <Center>
                          <Checkbox
                            onChange={evt => {
                              if (evt.currentTarget.value === "on") {
                                dispatch({ type: "add-option", date: opt });
                              } else {
                                dispatch({
                                  type: "remove-option",
                                  date: opt
                                });
                              }
                            }}
                            checked={state.vote.selectedOptions
                              .map(date => date.getTime())
                              .includes(opt.getTime())}
                          />
                        </Center>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </Center>
          </>
        )}
      </div>
      <Footer>
        <Button
          disabled={!isVoteBtnActive}
          title="Vote"
          type="submit"
          onClick={vote}
          size="large"
        >
          Vote
        </Button>
      </Footer>
    </form>
  );
};

const TableHeader: React.FC<{ poll: Poll }> = ({ poll }) => {
  return (
    <thead>
      <tr>
        <th />
        {poll.options.map(opt => (
          <th
            key={opt.getTime()}
            className={css`
              padding: 1.6rem;
            `}
          >
            <div
              className={css`
                display: flex;
                flex-direction: column;
              `}
            >
              <span
                className={css`
                  font-size: 2rem;
                  font-weight: 400;
                  color: ${colors.grey700};
                `}
              >
                {opt.toLocaleString("default", { month: "short" })}
              </span>
              <span
                className={css`
                  font-size: 2.4rem;
                  font-weight: 600;
                  color: ${colors.grey800};
                `}
              >
                {opt.getDate()}
              </span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

const Votes: React.FC<{ poll: Poll }> = ({ poll }) => {
  const votes = useVotes(poll.id);

  return (
    <>
      {votes.map(vote => (
        <tr key={vote.id}>
          <td>
            <Center>{vote.participantName}</Center>
          </td>
          {poll.options.map(opt => (
            <td key={`${vote.id}-${opt.getTime()}`}>
              <Center>
                {vote.selectedOptions
                  .map(opt => opt.getTime())
                  .includes(opt.getTime()) && (
                  <Icon
                    key={vote.id}
                    size="2rem"
                    name="check"
                    color={colors.green500}
                  />
                )}
              </Center>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
export default PollParticipation;
