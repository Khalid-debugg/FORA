import { useNavigate } from "react-router-dom";
const MenuItem: React.FC<{
  logoUrl: string;
  label: string;
  pagePath?: string;
  isActive?: boolean;
}> = ({ logoUrl, label, pagePath, isActive }) => {
  const navigate = useNavigate();

  return (
    <button
      className={`w-56  hover:bg-gray-100 flex justify-start items-center gap-3 p-4 rounded-2xl ${isActive ? "bg-gray-100" : "bg-white"}`}
      onClick={() => {
        if (pagePath) navigate(pagePath);
      }}
    >
      <img
        src={`/assets/icons/${logoUrl}.svg`}
        alt={`${logoUrl}`}
        className={`${isActive ? "h-10" : "h-8"}`}
      />
      <p className={` ${isActive ? "font-bold" : "font-[500] text-lg"}`}>
        {label}
      </p>
    </button>
  );
};

export default MenuItem;
