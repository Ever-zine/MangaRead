import DynamicBlur from "@/src/app/components/dynamicBlur";
import ResumeReading from "@/src/app/components/resumereading";
import fs from "fs";
import { useTranslations } from "next-intl";
import path from "path";
import ".././scrollbar.css";
import NavigationLink from "../components/navigationLink";

export default function Home() {
  const t = useTranslations("Home");
  const r = useTranslations("Resume");
  const mangaDirectory = path.join(process.cwd(), "public");
  const mangaNames = fs.readdirSync(mangaDirectory).filter((name) => {
    const itemPath = path.join(mangaDirectory, name);
    return fs.lstatSync(itemPath).isDirectory();
  });

  // Write the mangaNames array to a JSON file
  fs.writeFileSync(
    path.join(mangaDirectory, "manga.json"),
    JSON.stringify(mangaNames)
  );

  return (
    <div className="text-white">
      <div className="flex flex-nowrap justify-center items-center overflow-x-auto">
        <ResumeReading resumeTrad={r("title")} />
      </div>
      <hr className="my-8" />
      <h2 className="text-center text-3xl mb-4">{t("all")}</h2>
      <div className="mx-4">
        <div className="flex flex-nowrap justify-center items-center overflow-x-auto">
          {mangaNames.map((mangaName) => (
            <NavigationLink key={mangaName} href={`/manga/${mangaName}`}>
              <div className="flex flex-col items-stretch m-2 bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:opacity-80">
                <div className="relative h-32 sm:h-48 md:h-64  w-32 sm:w-48 md:w-64 flex-shrink-0">
                  <DynamicBlur
                    src={`/${mangaName}/Tome 01/01-001.webp`}
                    alt={mangaName}
                  />
                </div>
                <div className="p-2 flex-grow">
                  <h4 className="text-sm text-center text-white">
                    {mangaName}
                  </h4>
                </div>
              </div>
            </NavigationLink>
          ))}
        </div>
      </div>
    </div>
  );
}