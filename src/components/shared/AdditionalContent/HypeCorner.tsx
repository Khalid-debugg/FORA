import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SlEnergy } from "react-icons/sl";

const HypeCorner = () => {
  const [gifIndex, setGifIndex] = useState<number | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("hypeGifIndex");
    if (stored) {
      setGifIndex(Number(stored));
    } else {
      const random = Math.floor(Math.random() * 6);
      sessionStorage.setItem("hypeGifIndex", String(random));
      setGifIndex(random);
    }
  }, []);

  if (gifIndex === null) return null;

  return (
    <div className=" divide-y-2 divide-primary-500 bg-white rounded-xl shadow-sm border-2 border-primary-500">
      <div className="p-2 flex gap-2 items-center">
        <SlEnergy size={25} color="#30cc42" />
        <h2 className=" text-lg font-semibold">Hype Corner</h2>
      </div>
      <div className="p-2 flex flex-col gap-3">
        <img
          src={`/assets/images/hype/${gifIndex}.gif`}
          alt="Football moment"
          className="w-full rounded-md"
        />
        <Button
          className="shad-button_primary hover:shad-button_ghost self-end"
          onClick={() => setGifIndex(Math.floor(Math.random() * 6))}
        >
          Shuffle
        </Button>
      </div>
    </div>
  );
};

export default HypeCorner;
