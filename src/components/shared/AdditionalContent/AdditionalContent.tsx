import { useUserContext } from "@/context/AuthContext";
import { useGetUsersYouMayKnow } from "@/lib/react-query/queriesAndMutations/users";
import { useMemo } from "react";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import { useGetFriends } from "@/lib/react-query/queriesAndMutations/friendship";

const AdditionalContent = () => {
  const { user } = useUserContext();
  const { data: friends } = useGetFriends(user.id);
  const { data: users } = useGetUsersYouMayKnow(user, friends);
  const peopleYouMayKnow = useMemo(() => users?.pages.flat() || [], [users]);
  return (
    <div className="fixed right-0 top-0 p-2 w-1/3 max-w-1/3 h-screen hidden md:flex flex-col divide-y divide-primary-500">
      {/* {peopleYouMayKnow.length > 0 && ( */}
      <PeopleYouMayKnow peopleYouMayKnow={peopleYouMayKnow} />
      {/* )} */}
    </div>
  );
};

export default AdditionalContent;
