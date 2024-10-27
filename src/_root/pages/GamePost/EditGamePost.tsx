import {
  useEditGamePost,
  useGetCities,
  useGetJoinedGame,
} from "@/lib/react-query/queriesAndMutations";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { useEffect, useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { IoMdCloseCircle } from "react-icons/io";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const EditGamePost = ({ post, setIsEditing }) => {
  const { data: joinedGame } = useGetJoinedGame(post.$id);
  const { mutateAsync: editGame } = useEditGamePost();
  const [newJoinedPlayers, setNewJoinedPlayers] = useState([]);
  const [emptySpots, setEmptySpots] = useState(0);
  const handleDelete = (id) => {
    setNewJoinedPlayers(newJoinedPlayers.filter((player) => player.$id !== id));
  };
  const { data: governorates } = useGetCities();
  const [cities, setCities] = useState([]);

  const [newGovernorate, setNewGovernorate] = useState(
    post.location.split(" - ")[0],
  );
  const [newCity, setNewCity] = useState(post.location.split(" - ")[1]);
  const [newPlaygroundName, setNewPlaygroundName] = useState(
    post.location.split(" - ")[2],
  );
  const [newDate, setNewDate] = useState(post.date);
  useEffect(() => {
    if (governorates) {
      setCities(
        governorates?.find(
          (gov: { namePrimaryLang: string }) =>
            gov.namePrimaryLang === "North Sinai",
        ).cityDataModels,
      );
    }
  }, [governorates]);
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };
  const handleSaveChanges = async () => {
    if (!newCity) {
      toast({
        variant: "error",
        title: "Uh oh! Something went wrong.",
        description: "Please select a city and try again.",
      });
      return;
    }
    const response = await editGame({
      emptySpots,
      newJoinedPlayers,
      gameId: post.$id,
      joinedGameID: joinedGame ? joinedGame.$id : "",
      newLocation: `${newGovernorate} - ${newCity} - ${newPlaygroundName}`,
      newDate,
    });
    if (!response) {
      toast({
        variant: "error",
        title: "Uh oh! Something went wrong.",
        description: "Please try again.",
      });
    } else {
      toast({
        variant: "default",
        title: "Your game is edited successfully!",
      });
      setIsEditing(false);
    }
  };
  useEffect(() => {
    if (joinedGame?.joinedPlayers) {
      setNewJoinedPlayers(joinedGame?.joinedPlayers);
      setEmptySpots(post.playersNumber - joinedGame?.joinedPlayers.length);
    }
  }, [joinedGame, post.playersNumber]);

  return (
    <div>
      <div className="flex flex-col gap-4 divide-y-2 divide-primary-500">
        <h2 className="text-center text-2xl py-2">{"> Joined Players <"}</h2>
        <div className="flex flex-wrap items-center justify-center py-2">
          {newJoinedPlayers?.map((player, i) => (
            <div
              key={player.$id}
              className="min-w-[12rem] p-2 m-1 border border-slate-500 rounded-lg flex items-center justify-between hover:shadow-md hover:scale-105 hover:cursor-pointer transition-all 0.3s ease-in-out"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 hover:cursor-pointer rounded-full overflow-hidden">
                  <AvatarImage src={player.imageURL} />
                  <AvatarFallback>{player.username[0]}</AvatarFallback>
                </Avatar>

                <Link to={`/profile/${player.$id}`} className="hover:underline">
                  {player.username}
                </Link>
              </div>
              <AlertDialog>
                <AlertDialogTrigger>
                  <IoMdCloseCircle color="red" size={20} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone, this will remove{" "}
                      {player.username} from your game.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(player.$id)}
                      className="border-2 border-primary-500 rounded-md h-10"
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
          {Array.from({ length: emptySpots }).map((_, i) => (
            <div
              key={i}
              className="min-w-[12rem] p-2 m-1 border border-slate-500 rounded-lg flex items-center justify-between hover:shadow-md hover:scale-105 hover:cursor-pointer transition-all 0.3s ease-in-out"
            >
              <div className="flex items-center gap-4">
                <AiFillQuestionCircle fill="green" size={50} className="" />
                <p>Empty Slot</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger>
                  <IoMdCloseCircle color="red" size={20} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone, this will remove
                      {" this empty slot "}from your game.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => setEmptySpots(emptySpots - 1)}
                      className="border-2 border-primary-500 rounded-md h-10"
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
        <button
          onClick={() => setEmptySpots(emptySpots + 1)}
          className="shad-button_primary hover:shad-button_ghost w-1/2 mx-auto rounded-md p-2"
        >
          Add Empty Spot
        </button>
        <div className="flex flex-wrap gap-4 p-2">
          <div>
            <label htmlFor="governorate">Governorate</label>
            <Select
              id="governorate"
              value={newGovernorate}
              onValueChange={(value: string) => {
                setNewCity("");
                setNewGovernorate(value);
                const currentGov = governorates?.find(
                  (gov: { id: number; namePrimaryLang: string }) =>
                    gov.namePrimaryLang === value,
                );
                setCities(currentGov.cityDataModels);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a governorate" />
              </SelectTrigger>
              <SelectContent>
                {governorates &&
                  governorates.map(
                    (gov: { id: number; namePrimaryLang: string }) => (
                      <SelectItem key={gov.id} value={gov.namePrimaryLang}>
                        {gov.namePrimaryLang}
                      </SelectItem>
                    ),
                  )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="city">City</label>
            <Select
              id="city"
              value={newCity}
              onValueChange={(value: string) => setNewCity(value)}
              disabled={cities?.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {cities?.map(
                  (city: { id: number; namePrimaryLang: string }) => (
                    <SelectItem key={city.id} value={city.namePrimaryLang}>
                      {city.namePrimaryLang}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <label htmlFor="playgroundName">Playground's name</label>
            <Input
              id="playgroundName"
              value={newPlaygroundName}
              onChange={(e) => setNewPlaygroundName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <Input
              id="date"
              value={newDate}
              onChange={(e) =>
                setNewDate(
                  e.target.value.split("T")[0] +
                    " | " +
                    e.target.value.split("T")[1],
                )
              }
              type="datetime-local"
              className="outline outline-1 outline-primary-500"
              min={getCurrentDateTime()}
            />
          </div>
        </div>
        <div className="flex justify-between p-2">
          <AlertDialog>
            <AlertDialogTrigger className="bg-primary-500 p-2 rounded w-[40%] shad-button_primary hover:shad-button_ghost transition-all 0.3s ease-in-out">
              Save Changes
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone, this will edit your post with
                  the new modifications.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSaveChanges}
                  className="border-2 border-primary-500 rounded-md h-10 "
                >
                  Save changes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <button
            onClick={() => setIsEditing(false)}
            className="border border-primary-500 p-2 rounded w-[40%] hover:shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGamePost;
