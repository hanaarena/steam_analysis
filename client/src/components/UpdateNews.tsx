import { useEffect, useRef, useState } from "react";
import { get } from "@lanz/utils";
import { groupByYears } from "@/utils/times";
import { Gradients } from "@/utils/const";
import { Button, Group, HoverCard, Pagination, Text } from "@mantine/core";

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
const PageSize = 20;
const now = Math.floor(Date.now() / 1000);

export default function UpdateNews({ id }: { id: number | string }) {
  const [list, setList] = useState<Map<string, UpdateItem[]>>();
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState("");
  const [enddate, setEnddate] = useState(now);
  const [page, setPage] = useState(1);
  const tempList = useRef<UpdateItem[]>([]);

  const handleUpdateFilter = (year: string) => {
    setFilter(year);
  };

  const handlePageChange = (p: number) => {
    let _enddate = now;
    if (p > page) {
      _enddate = (tempList.current.pop()?.date || now) - 1;
    } else if (p < page) {
      _enddate = (tempList.current.shift()?.date || now) + 1;
    }
    setPage(p);
    setEnddate(_enddate);
  };

  useEffect(() => {
    const getUpdateNews = async () => {
      const target = encodeURIComponent(
        `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2?appid=${id}&count=${PageSize}&format=json&maxlength=300&feeds=steam_community_announcements&enddate=${enddate}`
      );
      const res = await get<{
        appnews: { newsitems: UpdateItem[]; count: number };
      }>(`${apiEndpoint}/proxy?url=${target}`);

      if (res.appnews?.newsitems?.length) {
        // sort newest -> oldest
        const sorted = res.appnews.newsitems.sort((a, b) => b.date - a.date);
        tempList.current = sorted;
        const grouped = groupByYears(sorted, "date");
        setList(grouped);
        const pickFirstYear = Array.from(grouped.keys())[0];
        setFilter(pickFirstYear);
      }

      if (!isNaN(res.appnews.count)) {
        setCount(res.appnews.count);
      }
    };

    getUpdateNews();
  }, [id, enddate]);

  return (
    <div className="mb-4">
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold">Updates News</h1>
        <p className="text-xs">Total news: {count}</p>
      </header>
      <div className="flex gap-2 flex-col mb-3">
        <div>
          Years: &nbsp;
          {(list ? Array.from(list?.keys()) : []).map((year) => (
            <Button
              key={year}
              variant={year === filter ? "filled" : "outline"}
              size="xs"
              radius="xl"
              color="rgba(115, 201, 255, 1)"
              onClick={() => handleUpdateFilter(year)}
              className="mr-2"
            >
              {year}
            </Button>
          ))}
        </div>
        <div className="grid grid-rows-2 grid-flow-col auto-fill-200 overflow-x-auto gap-2 border border-gray-100">
          {filter &&
            list?.get(filter)?.map((item, idx) => {
              const g = Gradients[idx % Gradients.length];
              return (
                <Group key={item.gid} className="grid">
                  <HoverCard width={280} shadow="md">
                    <HoverCard.Target>
                      <div
                        className={`w-[200px] p-3 bg-gradient-to-br ${g} rounded-sm shadow cursor-pointer flex flex-col text-sm text-white`}
                      >
                        <a
                          className="font-medium truncate"
                          target="_blank"
                          href={item.url}
                        >
                          {item.title}
                        </a>
                        <div className="text-xs opacity-90 mt-1">
                          {new Date(item.date * 1000).toLocaleDateString()}
                        </div>
                      </div>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-semibold text-gray-800 text-sm">
                          {item.title}
                        </h3>
                        <time className="text-xs text-gray-500">
                          {new Date(item.date * 1000).toLocaleString()}
                        </time>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-4">
                        {item.contents}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            className="text-blue-600 underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Detail
                          </a>
                        ) : null}
                      </div>
                    </HoverCard.Dropdown>
                  </HoverCard>
                </Group>
              );
            })}
        </div>
      </div>
      <div className="flex">
        <Text className="mr-2!">
          Showing {page} of {Math.ceil(count / PageSize)}
        </Text>
        <Pagination
          total={Math.ceil(count / PageSize)}
          size="sm"
          radius="lg"
          onChange={handlePageChange}
          withPages={false}
        />
      </div>
    </div>
  );
}
