import { useFirebase } from "../context/firebase-context";
import { useEffect, useState } from "react";

function useVotes(pollId?: string) {
  const { db } = useFirebase();
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    db.collection("polls")
      .doc(pollId)
      .collection("votes")
      .onSnapshot(data => {
        setVotes(data.docs
          .map(doc => ({ id: doc.id, data: doc.data() }))
          .map(doc => ({
            ...doc.data,
            id: doc.id,
            selectedOptions: doc.data.selectedOptions.map((opt: any) =>
              opt.toDate()
            )
          })) as Vote[]);
      });
  }, [db, pollId]);
  return votes;
}

export { useVotes };
