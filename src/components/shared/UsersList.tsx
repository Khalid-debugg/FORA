import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage } from "../ui/avatar";
import { GoHeart } from "react-icons/go";
import { Link } from "react-router-dom";

const UsersList = ({
  listTitle,
  listItems,
}: {
  listTitle: string;
  listItems: any[];
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="hover:underline flex gap-1 items-center">
        <p>{listItems.length}</p> <GoHeart size={25} fill="green" />
      </AlertDialogTrigger>
      <AlertDialogContent className="">
        <AlertDialogHeader>
          <AlertDialogTitle>{listTitle}</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-2 pr-2 max-h-[80vh] overflow-auto">
            {listItems.map((user) => (
              <div
                key={user.$id}
                className="p-4 border border-primary-500 flex gap-4 items-center rounded-lg"
              >
                <Avatar className="hover:cursor-pointer">
                  <AvatarImage
                    className="h-10 w-10 rounded-full outline outline-slate-200"
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
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UsersList;
