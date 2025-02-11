// ResumeReading.tsx
"use client";
import { Progress } from "@/components/ui/progress";
import { Clock3, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface MangaInfo {
  manga: string;
  volume: string;
  page: number;
  totalVolumes: number;
}

interface ResumeReadingProps {
  mangaName?: string;
}

export default function ResumeReading({ mangaName }: ResumeReadingProps) {
  const [state, setState] = useState<MangaInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Ajouter un état de chargement

  useEffect(() => {
    const storedState = localStorage.getItem("mangaInfo");
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      if (mangaName) {
        const filteredState = parsedState.filter(
          (manga: MangaInfo) => manga.manga === mangaName
        );
        setState(filteredState);
      } else {
        setState(parsedState);
      }
    }
    setIsLoading(false); // Mettre à jour l'état de chargement une fois les données chargées
  }, [mangaName]);

  const deleteManga = (index: number) => {
    setState((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1);
      localStorage.setItem("mangaInfo", JSON.stringify(newState));
      return newState;
    });
  };

  const calculateProgress = useMemo(() => {
    return (mangaInfo: MangaInfo) => {
      const currentVolumeNumber = parseInt(
        decodeURIComponent(mangaInfo.volume).split(" ")[1]
      );
      const totalVolumes = mangaInfo.totalVolumes;
      return (currentVolumeNumber / totalVolumes) * 100;
    };
  }, []);

  if (isLoading) {
    return (
      <div>
        <h2 className="w-full flex uppercase item-center justify-center text-xl md:text-2xl mb-4 mt-6 md:ml-4 md:justify-start md:items-start ">
          Reprenez votre visionnage
          <div className="ml-2">
            <Clock3 />
          </div>
        </h2>
        <div className="flex overflow-x-scroll overflow-y-hidden">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="m-2 relative">
                <div className="flex flex-col items-stretch rounded-lg overflow-hidden ">
                  <div className="relative h-32 sm:h-48 md:h-64 w-32 sm:w-48 md:w-64 flex-shrink-0 animate-pulse bg-gray-800"></div>
                  <div className="flex-grow p-2">
                    <div className="h-4 animate-pulse bg-gray-800"></div>
                    <div className="h-4 mt-2 animate-pulse bg-gray-800"></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (!state.length) {
    return null;
  }

  return (
    <div>
      <h2 className="w-full flex uppercase item-center justify-center text-xl md:text-2xl mb-4 mt-6 md:ml-4 md:justify-start md:items-start ">
        Reprenez votre visionnage
        <div className="ml-2">
          <Clock3 />
        </div>
      </h2>
      <div className="flex overflow-x-scroll  hover:cursor-default overflow-y-hidden">
        {state.map((mangaInfo, index) => (
          <div
            key={index}
            className="m-2 relative ease-in-out transform group hover:scale-105 transition-transform duration-300"
          >
            <div className="flex flex-col items-stretch rounded-lg overflow-hidden shadow-lg hover:shadow-2xl ease-in-out transform  transition-transform duration-300">
              <Link
                key={index}
                href={`/manga/${mangaInfo.manga}/${mangaInfo.volume}/`}
                className="hover:shadow-2xl ease-in-out transform  hover:scale-105 transition-transform duration-300"
              >
                <div className="relative h-32 sm:h-48 md:h-64 w-32 sm:w-48 md:w-64 flex-shrink-0 shine">
                  <Image
                    src={`/${mangaInfo.manga}/Tome 01/01-001.webp`}
                    alt={mangaInfo.manga}
                    quality={1}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 20vw"
                    className="transition-all duration-500 ease-in-out transform"
                  />
                </div>
                <div className="flex-grow p-2">
                  <p className="text-sm text-white overflow-wrap transition-colors duration-300 ease-in-out group-hover:text-red-500 break-words">
                    {decodeURIComponent(mangaInfo.manga)}
                  </p>
                  <div className="text-sm mt-2 text-gray-400 overflow-wrap break-words flex flex-col sm:flex-row">
                    <p className="sm:px-2">
                      Volume{" "}
                      {decodeURIComponent(mangaInfo.volume).split(" ")[1]}
                    </p>
                    <p className="sm:mx-4 sm:my-0 my-2 hidden sm:block">-</p>
                    <p className="sm:px-2">Page {mangaInfo.page}</p>
                  </div>
                  <div className="ml-auto flex flex-col items-center">
                    {mangaInfo.totalVolumes !== undefined && (
                      <>
                        <Progress
                          value={calculateProgress(mangaInfo)}
                          aria-label="Reading progress"
                        />
                        <p className="mt-2 text-gray-200 text-sm sm:px-2">
                          {`${
                            decodeURIComponent(mangaInfo.volume).split(" ")[1]
                          } / ${mangaInfo.totalVolumes}`}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteManga(index);
                }}
                className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-white hover:text-red-600 bg-black shadow-lg shadow-black outline outline-2 outline-gray-700 rounded transition-all duration-200"
                title="Supprimer de la liste de lecture"
              >
                <X />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
