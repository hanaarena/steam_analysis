import { useState } from "react";
import "./App.css";
import ReviewsChart from "./components/ReviewsChart";
import SaleStat from "./components/SaleStat";

// temporary App ID
const app_id = "867210";

export default function App() {
  const [id, setId] = useState(app_id);

  const handleSubmit = () => {
    // TODO: fetch data by app ID
  };

  return (
    <div className="w-11/12 flex flex-col justify-center my-0 mx-auto">
      <div className="my-2 mb-4">
        App ID: &nbsp;
        <input
          className="border indent-2 mr-2"
          type="text"
          value={id}
          name="app_id"
          onChange={(e) => setId(e.target.value)}
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="py-1 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white dark:focus:bg-white/20 dark:focus:text-white hover:cursor-pointer"
        >
          Submit
        </button>
      </div>
      <div className="header w-full flex gap-4 mb-6">
        <div className="cover flex-1">
          <img src="//shared.fastly.steamstatic.com/store_item_assets/steam/apps/570/header.jpg" />
        </div>
        <div className="desp flex-1">
          <p className="font-bold text-lg">Dota ({app_id})</p>
          <p className="text-sm mb-2">
            <span className="mr-4">Developer: Value</span>
            <span>Publisher: Value</span>
          </p>
          <p className="max-h-[7.8em] multi-line-ellipsis">
            Every day, millions of players worldwide enter battle as one of over
            a hundred Dota heroes. And no matter if it's their 10th hour of play
            or 1,000th, there's always something new to discover. With regular
            updates that ensure a constant evolution of gameplay, features, and
            heroes, Dota 2 has taken on a life of its own.
          </p>
        </div>
      </div>
      <div className="content">
        <SaleStat id={id} />
        <ReviewsChart id={id} />
      </div>
    </div>
  );
}
