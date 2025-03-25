"use client"; // This is now a client component

import { IKImage } from "imagekitio-next";
import config from "@/lib/config";

const UniversityCard = ({ path }: { path: string }) => {
  return (
    <div className="relative w-64 h-80 rounded-lg overflow-hidden shadow-lg">
      <IKImage
        path={path}
        urlEndpoint={config.env.imagekit.urlEndpoint}
        alt="University ID Card"
        width={256}
        height={320}
        className="object-contain rounded-lg"
        loading="lazy"
        lqip={{ active: true }}
      />
    </div>
  );
};

export default UniversityCard;
