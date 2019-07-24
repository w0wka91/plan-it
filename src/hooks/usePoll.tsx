import { useFirebase } from "../context/firebase-context";
import { useEffect, useState, useLayoutEffect } from "react";

function usePoll(id?: string) {
  const { db } = useFirebase();
  const [firstAttemptFinished, setFirstAttemptFinished] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const [poll, setPoll] = useState<undefined | Poll>(undefined);

  useLayoutEffect(() => {
    if (isSettled) {
      setFirstAttemptFinished(true);
    }
  }, [isSettled]);

  useEffect(() => {
    const pollRef = db.collection("polls").doc(id);
    pollRef
      .get()
      .then(doc => {
        const pollData = doc.data();
        if (pollData) {
          pollData.options = pollData.options.map(
            (opt: firebase.firestore.Timestamp) => opt.toDate()
          );
          pollData.id = doc.id;
          setPoll(pollData as Poll);
        }
      })
      .finally(() => setIsSettled(true));
  }, [db, id]);
  return { firstAttemptFinished, poll };
}

export { usePoll };
