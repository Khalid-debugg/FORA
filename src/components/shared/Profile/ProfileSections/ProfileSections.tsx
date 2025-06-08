import { lazy, Suspense, useState } from "react";
import { BsPostcard } from "react-icons/bs";
import { TbPlayFootball } from "react-icons/tb";
import { AiFillLike } from "react-icons/ai";
const Posts = lazy(() => import("./Sections/Posts"));
const Games = lazy(() => import("./Sections/Games"));
const Likes = lazy(() => import("./Sections/Likes"));
const Sections = [
  {
    title: "Posts",
    icon: <BsPostcard color="#30cc42" size={20} />,
    component: (
      <Suspense fallback={<div className="text-center animate-spin">⚽</div>}>
        <Posts />
      </Suspense>
    ),
    id: 1,
  },
  {
    title: "Games",
    icon: <TbPlayFootball color="#30cc42" size={20} />,
    component: (
      <Suspense fallback={<div className="text-center animate-spin">⚽</div>}>
        <Games />
      </Suspense>
    ),
    id: 2,
  },
  {
    title: "Likes",
    icon: <AiFillLike color="#30cc42" size={20} />,
    component: (
      <Suspense fallback={<div className="text-center animate-spin">⚽</div>}>
        <Likes />
      </Suspense>
    ),
    id: 3,
  },
];
const ProfileSections = () => {
  const [currentSection, setCurrentSection] = useState(Sections[0]);

  return (
    <>
      <div className="w-full flex">
        {Sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setCurrentSection(section)}
            className={`flex flex-1 justify-center items-center gap-2 hover:bg-gray-100 p-4 rounded-md relative ${
              currentSection.id === section.id ? "text-primary-500" : ""
            }`}
          >
            {section.icon}
            {section.title}
            <span
              className={`absolute bottom-0 left-0 ${
                currentSection.id === section.id
                  ? "w-full bg-primary-500"
                  : "w-0"
              } h-1 transition-all duration-500 ease-in-out `}
            />
          </button>
        ))}
      </div>
      <div>
        {Sections.map((section) => (
          <div
            key={section.id}
            className={currentSection.id === section.id ? "block" : "hidden"}
          >
            {section.component}
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfileSections;
