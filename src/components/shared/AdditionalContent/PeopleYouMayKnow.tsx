"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Eye, AtSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PeopleYouMayKnow = ({
  peopleYouMayKnow,
  isGettingUsers,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border-2 border-primary-500/20 hover:border-primary-500/40 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent pointer-events-none" />
      <div className="relative p-4 border-b border-primary-500/20 bg-gradient-to-r from-primary-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-500/10 rounded-xl border border-primary-500/20">
            <Users size={20} className="text-primary-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              People You May Know
            </h2>
            <p className="text-sm text-gray-600">Connect with others</p>
          </div>
        </div>
      </div>
      <div className="relative p-4">
        <div className="flex flex-col gap-3">
          {isGettingUsers && (
            <div className="flex items-center justify-center py-8">
              <div className="text-2xl animate-spin">⚽</div>
              <span className="ml-2 text-gray-600">Finding people...</span>
            </div>
          )}

          {!isGettingUsers &&
            peopleYouMayKnow.map((user) => (
              <div
                key={user?.$id}
                className="group relative p-4 bg-white/50 border-2 border-primary-500/10 hover:border-primary-500/30 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl pointer-events-none" />

                <div className="relative flex gap-4 items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="relative">
                      <Avatar className="hover:cursor-pointer ring-2 ring-primary-500/20 hover:ring-primary-500/40 transition-all duration-200">
                        <AvatarImage
                          className="h-10 w-10 rounded-full"
                          src={user?.imageUrl || "/placeholder.svg"}
                        />
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                        {user?.name}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <AtSign size={12} className="text-primary-500" />
                        {user?.username}
                      </p>
                    </div>
                  </div>

                  <Button
                    className="bg-primary-500/10 hover:bg-primary-500 text-primary-600 hover:text-white border-primary-500/20 hover:border-primary-500 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl px-4"
                    onClick={() => {
                      navigate(`/profile/${user?.$id}`);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Eye size={14} className="mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}

          {hasNextPage && (
            <div className="flex justify-center mt-4">
              <Button
                className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-8"
                onClick={fetchNextPage}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Loading...
                  </>
                ) : (
                  "Show More"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeopleYouMayKnow;
