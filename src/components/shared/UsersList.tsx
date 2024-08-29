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

const UsersList = ({
  listTitle,
  buttonTitle,
  listItems,
}: {
  listTitle: string;
  buttonTitle?: string;
  listItems: any[];
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="hover:underline">
        {buttonTitle}
      </AlertDialogTrigger>
      <AlertDialogContent className="">
        <AlertDialogHeader>
          <AlertDialogTitle>{listTitle}</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-2 pr-2 max-h-[80vh] overflow-auto">
            {listItems.map((user) => (
              <div
                key={user.username}
                className="p-4 border border-primary-500 flex gap-4 items-center rounded-lg"
              >
                <Avatar className="hover:cursor-pointer">
                  <AvatarImage
                    className="h-12 w-12 rounded-full outline outline-slate-200"
                    src={user.imageURL}
                  />
                </Avatar>
                <p className="text-lg font-medium hover:underline hover:cursor-pointer">
                  {user.username}
                </p>
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
