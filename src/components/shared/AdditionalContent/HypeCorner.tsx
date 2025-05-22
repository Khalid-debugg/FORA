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
      const random = Math.floor(Math.random() * 20);
      sessionStorage.setItem("hypeGifIndex", String(random));
      setGifIndex(random);
    }
  }, []);

  if (gifIndex === null) return null;

  return (
    <div className=" divide-y divide-primary-500 bg-white rounded-xl shadow-sm border border-primary-500">
      <div className="p-2 flex gap-2 items-center">
        <SlEnergy size={25} color="#30cc42" />
        <h2 className=" text-lg font-semibold">Hype Corner</h2>
      </div>
      <div className="p-2 flex flex-col gap-3">
        <video
          src={`/assets/videos/hype/${gifIndex}.mp4`}
          controls={false}
          className="w-full h-full object-contain"
          autoPlay={true}
          muted
          loop
        />
        <Button
          className="shad-button_primary hover:shad-button_ghost self-end"
          onClick={() => {
            const random = Math.floor(Math.random() * 20);
            setGifIndex(random);
          }}
        >
          Shuffle
        </Button>
      </div>
    </div>
  );
};

export default HypeCorner;
