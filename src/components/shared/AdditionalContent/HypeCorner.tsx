import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Zap, Shuffle } from "lucide-react";

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
    <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border-2 border-primary-500/20 hover:border-primary-500/40 transition-all duration-300 ">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent pointer-events-none" />
      <div className="relative p-4 border-b border-primary-500/20 bg-gradient-to-r from-primary-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-500/10 rounded-xl border border-primary-500/20">
            <Zap size={20} className="text-primary-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Hype Corner</h2>
            <p className="text-sm text-gray-600">Get energized!</p>
          </div>
        </div>
      </div>
      <div className="relative p-4">
        <div className="relative rounded-xl overflow-hidden border-2 border-primary-500/20 w-full bg-black/5">
          <video
            src={`/assets/videos/hype/${gifIndex}.mp4`}
            controls={false}
            className="w-full rounded-lg"
            autoPlay={true}
            muted
            loop
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none rounded-lg" />
        </div>
        <div className="flex justify-end mt-4">
          <Button
            className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-6"
            onClick={() => {
              const random = Math.floor(Math.random() * 20);
              sessionStorage.setItem("hypeGifIndex", String(random));
              setGifIndex(random);
            }}
          >
            <Shuffle size={16} className="mr-2" />
            Shuffle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HypeCorner;
