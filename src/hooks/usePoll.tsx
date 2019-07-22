import { useFirebase } from "../context/firebase-context";
import { useEffect, useState } from "react";

function usePoll(id?: string) {
  const { db } = useFirebase();
  const [poll, setPoll] = useState<undefined | Poll>(undefined);

  useEffect(() => {
    const pollRef = db.collection("polls").doc(id);
    pollRef.get().then(doc => {
      const pollData = doc.data();
      if (pollData) {
        pollData.options = pollData.options.map(
          (opt: firebase.firestore.Timestamp) => opt.toDate()
        );
        pollData.id = doc.id;
        setPoll(pollData as Poll);
      } else {
        throw new Error("Cannot find poll with id " + id);
      }
    });
  }, [db, id]);
  return poll;
}

export { usePoll };
