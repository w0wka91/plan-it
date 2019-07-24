import { RouteComponentProps } from "@reach/router";
import { css } from "emotion";
import React, { useReducer, useEffect, useRef } from "react";
import { Button, Calendar, Input, Checkbox } from "react-atomicus";
import { Footer } from "../components/Footer";
import Heading from "../components/Heading";
import { useFirebase } from "../context/firebase-context";

type State = {
  currentStep: number;
  poll: Poll;
  isContinueBtnActive: boolean;
};

type Action =
  | { type: "next-step" }
  | { type: "prev-step" }
  | { type: "activate-continue-button" }
  | { type: "disable-continue-button" }
  | { type: "change-title"; title: string }
  | { type: "change-creator-name"; name: string }
  | { type: "change-creator-email"; email: string }
  | { type: "toggle-update-me" }
  | { type: "add-option"; option: Date }
  | { type: "delete-option"; option: Date }
  | { type: "finish-poll-creation"; id: string };

const appReducer: React.Reducer<State, Action> = (
  prevState: State,
  action: Action
) => {
  switch (action.type) {
    case "next-step":
      return {
        ...prevState,
        currentStep: prevState.currentStep + 1
      };
    case "prev-step":
      return {
        ...prevState,
        currentStep: prevState.currentStep - 1
      };
    case "activate-continue-button":
      return {
        ...prevState,
        isContinueBtnActive: true
      };
    case "disable-continue-button":
      return {
        ...prevState,
        isContinueBtnActive: false
      };
    case "change-title":
      return {
        ...prevState,
        poll: { ...prevState.poll, title: action.title }
      };
    case "change-creator-name":
      return {
        ...prevState,
        poll: {
          ...prevState.poll,
          creator: { ...prevState.poll.creator, name: action.name }
        }
      };
    case "change-creator-email":
      return {
        ...prevState,
        poll: {
          ...prevState.poll,
          creator: { ...prevState.poll.creator, email: action.email }
        }
      };
    case "toggle-update-me":
      return {
        ...prevState,
        poll: {
          ...prevState.poll,
          creator: {
            ...prevState.poll.creator,
            updateMe: !prevState.poll.creator.updateMe
          }
        }
      };
    case "add-option":
      return {
        ...prevState,
        poll: {
          ...prevState.poll,
          options: [...prevState.poll.options, action.option]
        }
      };
    case "delete-option":
      return {
        ...prevState,
        poll: {
          ...prevState.poll,
          options: prevState.poll.options.filter(
            opt => opt.getTime() !== action.option.getTime()
          )
        }
      };
    case "finish-poll-creation":
      return {
        ...prevState,
        currentStep: prevState.currentStep + 1,
        poll: {
          ...prevState.poll,
          id: action.id
        }
      };

    default:
      return prevState;
  }
};

const PollCreation: React.FC<RouteComponentProps> = () => {
  const [state, dispatch] = useReducer(appReducer, {
    currentStep: 1,
    poll: {
      title: "",
      options: [],
      creator: { name: "", email: "", updateMe: false }
    },
    isContinueBtnActive: false
  });
  const { db } = useFirebase();

  const finishPollCreation = () => {
    db.collection("polls")
      .add(state.poll)
      .then(doc => {
        dispatch({ type: "finish-poll-creation", id: doc.id });
      });
  };

  const isFinished = state.currentStep === 4;
  const renderStep = (step: number) => {
    switch (step) {
      case 1:
        return <OccasionForm state={state} dispatch={dispatch} />;
      case 2:
        return <OptionSelection state={state} dispatch={dispatch} />;
      case 3:
        return <CreatorInfoForm state={state} dispatch={dispatch} />;
      case 4:
        return <InviteParticipants state={state} dispatch={dispatch} />;
    }
  };
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
        {renderStep(state.currentStep)}
      </div>
      {!isFinished && (
        <Footer>
          <Button
            title="Previous step"
            hierarchy="tertiary"
            disabled={state.currentStep === 1}
            className={css`
              margin-right: auto;
            `}
            size="large"
            type="button"
            onClick={() => dispatch({ type: "prev-step" })}
          >
            Back
          </Button>
          <Button
            disabled={!state.isContinueBtnActive}
            type="submit"
            title="Next step"
            size="medium"
            onClick={() =>
              state.currentStep !== 3
                ? dispatch({ type: "next-step" })
                : finishPollCreation()
            }
          >
            <span>{state.currentStep !== 3 ? "Continue" : "Finish"}</span>
          </Button>
        </Footer>
      )}
    </form>
  );
};

interface StepProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const OccasionForm: React.FC<StepProps> = ({ state, dispatch }: StepProps) => {
  useEffect(() => {
    if (state.poll.title.trim() !== "") {
      dispatch({ type: "activate-continue-button" });
    } else {
      dispatch({ type: "disable-continue-button" });
    }
  }, [state.poll.title, dispatch]);
  return (
    <>
      <Heading>What’s the occasion?</Heading>
      <Input
        autoFocus
        iconRight="align-center"
        label="Title"
        autoComplete="off"
        type="text"
        value={state.poll.title}
        onChange={e =>
          dispatch({ type: "change-title", title: e.currentTarget.value })
        }
        fluid
      />
    </>
  );
};

const OptionSelection: React.FC<StepProps> = ({
  state,
  dispatch
}: StepProps) => {
  useEffect(() => {
    if (state.poll.options.length > 0) {
      dispatch({ type: "activate-continue-button" });
    } else {
      dispatch({ type: "disable-continue-button" });
    }
  }, [state.poll.options, dispatch]);
  const handleDateSelection = (date: Date) => {
    if (state.poll.options.find(opt => opt.getTime() === date.getTime())) {
      dispatch({ type: "delete-option", option: date });
    } else {
      dispatch({ type: "add-option", option: date });
    }
  };

  return (
    <>
      <Heading>What are the options?</Heading>
      <div
        className={css`
          width: 100%;
        `}
      >
        <Calendar minDate={new Date()} onSelect={handleDateSelection} />
      </div>
    </>
  );
};

const CreatorInfoForm: React.FC<StepProps> = ({
  state,
  dispatch
}: StepProps) => {
  useEffect(() => {
    if (
      state.poll.creator.email.trim() !== "" &&
      state.poll.creator.name.trim() !== ""
    ) {
      dispatch({ type: "activate-continue-button" });
    } else {
      dispatch({ type: "disable-continue-button" });
    }
  }, [state.poll.creator.email, state.poll.creator.name, dispatch]);
  return (
    <div>
      <Heading>Tell your participants who you are?</Heading>
      <Input
        autoFocus
        iconRight="user"
        label="Name"
        autoComplete="off"
        type="text"
        value={state.poll.creator.name}
        className={css`
          margin-bottom: 1.6rem;
        `}
        onChange={e =>
          dispatch({ type: "change-creator-name", name: e.currentTarget.value })
        }
        fluid
      />
      <Input
        iconRight="mail"
        label="Email"
        autoComplete="off"
        type="text"
        value={state.poll.creator.email}
        className={css`
          margin-bottom: 1.6rem;
        `}
        onChange={e =>
          dispatch({
            type: "change-creator-email",
            email: e.currentTarget.value
          })
        }
        fluid
      />
      {/* <Checkbox
        label="Stay updated"
        onChange={() => dispatch({ type: "toggle-update-me" })}
        checked={state.poll.creator.updateMe}
      /> */}
    </div>
  );
};

const InviteParticipants: React.FC<StepProps> = ({ state }: StepProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Heading>Invite participants!</Heading>
      <Input
        iconLeft="link"
        ref={inputRef}
        autoComplete="off"
        type="text"
        value={`${window.location.href}poll/${state.poll.id}`}
        className={css`
          margin-bottom: 1.6rem;
        `}
        fluid
        readOnly
      />
      <Button
        onClick={() => {
          console.log(inputRef.current);
          if (inputRef.current) {
            inputRef.current.select();
            document.execCommand("copy");
          }
        }}
        title="Copy link"
      >
        Copy
      </Button>
    </>
  );
};

export default PollCreation;
