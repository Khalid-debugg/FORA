import NotificationCard from "@/components/shared/NotificationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from "@/context/AuthContext";
import { useGetNotifications } from "@/lib/react-query/queriesAndMutations/notifications";

const Notifications = () => {
  const { user } = useUserContext();
  const { data: notifications, isPending: isGettingNotifications } =
    useGetNotifications(user?.id || "", {
      enabled: !!user?.id,
    });

  return (
    <div className="flex flex-col gap-4 md:w-1/3 w-full mx-auto items-center">
      <div className="flex items-center w-full shadow-md">
        <h1 className="text-xl px-4 py-8">Notifications</h1>
      </div>
      {notifications?.length === 0 ? (
        <p className="text-center text-gray-500 pt-10">No notifications ❎</p>
      ) : isGettingNotifications ? (
        <Skeleton className="w-full h-10" />
      ) : (
        <div className="w-full p-2 flex flex-col gap-2">
          {notifications?.map((notification) => (
            <NotificationCard
              key={notification.$id}
              notification={notification}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
