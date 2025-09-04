import { useEffect, useState } from "react";
import { get } from "@lanz/utils";
import { parseNum } from "@/utils/num";

const apiEndpoint = import.meta.env.VITE_API;

export default function SaleStat(id: { id: number | string }) {
  const [stat, setStat] = useState<ISaleStat>({} as ISaleStat);

  const getStat = async () => {
    const data = await get<ISaleStat>(
      `${apiEndpoint}/game/3338950?include_pre_release_history=true`
    );
    setStat(data);
  };

  useEffect(() => {
    getStat();
  }, [id]);

  return (
    <div className="container-sale-stat mb-4">
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold">Game Sale Stat</h1>
      </header>

      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded shadow">
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Price:</span> ${stat.price}
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Reviews:</span> {stat.reviews}
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Followers:</span>{" "}
          {parseNum(stat.followers)}
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Avg Playtime:</span>{" "}
          {parseNum(stat.avgPlaytime, 2)} hours
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Review Score:</span> {stat.reviewScore}%
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Genres:</span> {stat.genres?.join(", ")}
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Copies sold:</span>{" "}
          {parseNum(stat.copiesSold)}
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Owners:</span> {parseNum(stat.owners)}
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Revenue:</span> ${parseNum(stat.revenue)}
        </p>
      </div>
    </div>
  );
}
