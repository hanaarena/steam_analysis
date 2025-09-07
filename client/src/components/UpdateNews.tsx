import { useEffect, useState } from "react";
import { get } from "@lanz/utils";

type UpdateItem = {
  gid: string;
  title: string;
  url?: string;
  author?: string;
  contents?: string;
  feedlabel?: string;
  date: number; // unix timestamp
  appid?: number;
  tags?: string[];
};

const apiEndpoint = import.meta.env.VITE_STEAM_API;

export default function UpdateNews({ id }: { id: number | string }) {
  const [list, setList] = useState<UpdateItem[]>([]);
  const [count, setCount] = useState(0);

  const gradients = [
    "from-indigo-500 to-blue-400",
    "from-pink-500 to-orange-400",
    "from-green-400 to-teal-500",
    "from-purple-500 to-pink-400",
    "from-yellow-400 to-orange-300",
    "from-sky-500 to-indigo-400",
  ];

  useEffect(() => {
    const getUpdateNews = async () => {
      const target = encodeURIComponent(
        `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${id}&count=10&format=json&maxlength=300&feeds=steam_community_announcements`
      );
      const res = await get<{
        appnews: { newsitems: UpdateItem[] };
        count: number;
      }>(`${apiEndpoint}/proxy?url=${target}`);
      console.warn("kekek res", res);

      if (res.appnews?.newsitems?.length) {
        // sort newest -> oldest
        const sorted = res.appnews.newsitems.sort((a, b) => b.date - a.date);
        setList(sorted);
      }
      if (!isNaN(res.count)) {
        setCount(res.count);
      }
    };

    getUpdateNews();
  }, [id]);

  if (!list.length) {
    return "";
  }

  return (
    <div className="max-w-4xl mb-4">
      <header className="mb-4">
        <h2 className="text-xl font-bold">Updates News</h2>
        <p className="text-xs">Total news: {count}</p>
      </header>

      <div className="flex gap-2 flex-wrap items-center">
        {list.map((it, idx) => {
          const g = gradients[idx % gradients.length];
          return (
            <div
              key={it.gid}
              className="group relative"
              tabIndex={0}
              aria-label={it.title}
            >
              <div
                className={`min-w-[180px] max-w-xs p-3 bg-gradient-to-br ${g} rounded-sm shadow cursor-pointer flex flex-col text-sm text-white`}
              >
                <div className="font-medium truncate">{it.title}</div>
                <div className="text-xs opacity-90 mt-1">
                  {new Date(it.date * 1000).toLocaleDateString()}
                </div>
              </div>

              {/* popup card shown on hover or focus */}
              <div className="opacity-0 invisible group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100 transition-all duration-150 absolute z-50 left-0 mt-2 w-96 bg-white border rounded p-3 shadow-lg pointer-events-auto">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {it.title}
                  </h3>
                  <time className="text-xs text-gray-500">
                    {new Date(it.date * 1000).toLocaleString()}
                  </time>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-4">
                  {it.contents}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                  {it.author ? <span>By {it.author}</span> : null}
                  {it.feedlabel ? <span>· {it.feedlabel}</span> : null}
                  {it.url ? (
                    <a
                      href={it.url}
                      target="_blank"
                      className="text-blue-600 underline"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Read
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
