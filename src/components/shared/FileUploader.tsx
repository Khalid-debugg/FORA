/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const FileUploader = ({ fieldChange, mediaUrl }: any) => {
  const [file, setFile] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);
  const inputRef = useRef(null);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      await setFile((prev) => prev.concat(acceptedFiles));
      fieldChange(file);
      const urls = acceptedFiles.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type,
      }));
      setFileUrls((prev) => prev.concat(urls));
    },
    [file, fieldChange],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "video/mp4": [".mp4", ".MP4"],
    },
  });

  const handleDelete = (index: number) => {
    setFile((prev) => prev.filter((_, i) => i !== index));
    setFileUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCarouselClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleAddClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="border py-5 border-primary-500 rounded-md flex flex-col justify-center items-center gap-2 min-h-[15rem]">
      <div {...getRootProps()} className="mx-auto w-1/2">
        <input {...getInputProps()} ref={inputRef} />
        <>
          {fileUrls.length > 0 ? (
            <div onClick={handleCarouselClick}>
              <Carousel>
                <CarouselContent className="flex items-center">
                  {fileUrls.map(({ url, type }, index) => (
                    <CarouselItem key={index} className="relative">
                      <button
                        className="absolute top-0 right-0 m-2 bg-red-600 text-white rounded-sm px-3 z-40"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(index);
                        }}
                      >
                        &times;
                      </button>
                      {type?.startsWith("image/") ? (
                        <img
                          src={url}
                          className="w-full max-w-xl max-h-[500px] object-cover object-center"
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        <video
                          controls
                          className="w-full max-w-xl max-h-[500px] object-cover object-center"
                        >
                          <source src={url} type={type} />
                        </video>
                      )}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          ) : (
            <>
              <img
                src="./assets/icons/file-upload.svg"
                alt=""
                className="mx-auto"
                loading="lazy"
              />
              <p className="text-lg font-[600] text-center">
                Upload your media
              </p>
              <p className="text-center">Click here or drag and drop</p>
            </>
          )}
          {isDragActive && <p className="text-center">Release here ...</p>}
        </>
      </div>
      <button
        className="m-4 px-4 py-2 bg-primary-500 text-white rounded-md shadow-lg"
        onClick={handleAddClick}
      >
        Add Media
      </button>
    </div>
  );
};

export default FileUploader;
