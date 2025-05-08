import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const PeopleYouMayKnow = ({ peopleYouMayKnow }) => {
  console.log(peopleYouMayKnow);

  return (
    <div className=" rounded-lg border-2 divide-y-2 divide-primary-500 border-primary-500">
      <h2 className="p-2">People You May Know</h2>
      <div className="p-2 flex flex-col gap-2">
        {peopleYouMayKnow.map((user) => (
          <div
            key={user.username}
            className="p-4 border border-slate-200 flex gap-4 items-center rounded-lg"
          >
            <Avatar className="hover:cursor-pointer">
              <AvatarImage
                className="h-12 w-12 rounded-full outline outline-slate-200"
                src={user.imageUrl}
              />
            </Avatar>
            <Link
              to={`/profile/${user.$id}`}
              className="text-lg font-medium hover:underline hover:cursor-pointer"
            >
              {user.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleYouMayKnow;
