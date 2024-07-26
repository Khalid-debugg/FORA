import { ICreatedPost } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
const NormalPost = ({ post }: { post: ICreatedPost }) => {
  const date = new Date(post.$createdAt);
  const formatDate = () => {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };
  const renderCarousel = () => {
    if (post.media.length === 0) return null;
    return post.media.map((mediaSrc) => {
      return (
        <CarouselItem>
          <img
            className="max-h-[500px] object-cover w-full"
            src={mediaSrc}
            alt=""
          />
        </CarouselItem>
      );
    });
  };
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col w-full p-4 rounded-3xl gap-1 border-2 border-primary-500">
          <div className="flex py-1 justify-between items-center">
            <div className="flex gap-3 items-center">
              <img
                src={post.creator.imageURL}
                className="rounded-full w-14 h-14 border border-black"
                alt="profile pic"
              />
              <p>{post.creator.username}</p>
            </div>
            <div>{formatDate()}</div>
          </div>
          <div className="h-[0.125rem] bg-black"></div>
          <div className="p-2">{post.caption}</div>
          <div className="p-2">
            <Carousel className="flex border justify-center px-8">
              <CarouselContent>{renderCarousel()}</CarouselContent>
              {post.media.length >= 1 && <CarouselPrevious className="" />}
              {post.media.length >= 1 && <CarouselNext />}
            </Carousel>
          </div>
        </div>
      </div>
      <div></div>
      <div></div>
    </div>
  );
};

export default NormalPost;
