// ResumeReading.tsx
// ResumeReading.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "../scrollbar.css";

export default function ResumeReading() {
  const [state, setState] = useState<
    Array<{
      manga: string;
      volume: string;
      page: number;
    }>
  >([]);

  useEffect(() => {
    const storedState = localStorage.getItem("mangaInfo");
    if (storedState) {
      setState(JSON.parse(storedState));
    }
  }, []);

  if (!state.length) {
    return null;
  }

  return (
    <div className="flex flex-nowrap justify-start items-center overflow-x-auto mx-8">
      {state.map((mangaInfo, index) => (
        <Link
          key={index}
          href={`/manga/${mangaInfo.manga}/${mangaInfo.volume}/`}
        >
          <div className="flex flex-col items-stretch m-2 bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:opacity-80">
            <div className="relative h-32 sm:h-48 md:h-64 w-32 sm:w-48 md:w-64 flex-shrink-0">
              <Image
                src={`/${mangaInfo.manga}/Tome 01/01-001.webp`}
                alt={mangaInfo.manga}
                quality={1}
                fill
                style={{ objectFit: "cover" }}
                sizes="70vw"
                className="transition-all duration-500 ease-in-out transform 5  "
              />
            </div>
            <div className="p-2 flex-grow">
              <p className="text-sm text-center text-white">
                {mangaInfo.manga} <br></br> Volume{" "}
                {decodeURIComponent(mangaInfo.volume).split(" ")[1]} <br></br>{" "}
                Page {mangaInfo.page}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
