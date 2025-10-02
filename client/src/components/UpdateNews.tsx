import { useEffect, useRef, useState } from "react";
import { get } from "@lanz/utils";
import { groupByYears } from "@/utils/times";
import { Gradients } from "@/utils/const";
import { Button, Group, HoverCard } from "@mantine/core";
import { useIntersectionObserver } from "@/hooks/useObserve";

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

const PageSize = 20;
const now = () => Math.floor(Date.now() / 1000);
const AllFilter = "All";

export default function UpdateNews({ id }: { id: number | string }) {
  const [list, setList] = useState<Map<string, UpdateItem[]>>(new Map());
  const [filter, setFilter] = useState(AllFilter);
  const [enddate, setEnddate] = useState(now()); // enddate === -1 is the last content
  const [loading, setLoading] = useState(false);
  const firstRender = useRef(true);

  const handleUpdateFilter = (year: string) => {
    setFilter(year);
  };

  const handleEnddateChange = () => {
    const _list = list.get(AllFilter) || [];
    const _enddate = _list[_list.length - 1]?.date - 1;
    setEnddate(_enddate);
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const getUpdateNews = async () => {
      if (enddate === -1) return;
      setLoading(true);
      const target = encodeURIComponent(
        `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2?appid=${id}&count=${PageSize}&format=json&maxlength=300&feeds=steam_community_announcements&enddate=${enddate}`
      );
      const res = await get<{
        appnews: { newsitems: UpdateItem[]; count: number };
      }>(`/proxy?url=${target}`);

      if (res.appnews?.newsitems?.length) {
        // sort newest -> oldest
        const sorted = res.appnews.newsitems.sort((a, b) => b.date - a.date);
        // update "All" filter tag & append to {list}
        const allList2 = list.set(AllFilter, [
          ...(list.get(AllFilter) || []),
          ...sorted,
        ]);
        const grouped = groupByYears(sorted, "date");
        setList(new Map([...allList2, ...grouped]));
      } else {
        // all data already fetched
        setEnddate(-1);
      }

      setLoading(false);
    };
    getUpdateNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, enddate]);

  useEffect(() => {
    // when app ID input value changed
    setEnddate(now());
  }, [id]);

  const loaderRef = useIntersectionObserver<HTMLDivElement>(
    handleEnddateChange,
    loading
  );

  return (
    <div className="mb-4">
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold">Updates News</h1>
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
        <div className="border border-gray-100 h-48 overflow-y-auto pb-4 pl-2 pt-2">
          <div className="flex flex-wrap content-start gap-2">
            {filter &&
              list?.get(filter) &&
              list?.get(filter)?.map((item, idx) => {
                const g = Gradients[idx % Gradients.length];
                return (
                  <Group key={`${filter}_${item.gid}`} className="grid">
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
                          <time className="text-xs text-gray-500 text-right">
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
          {enddate > -1 && filter === AllFilter && (
            <div
              ref={loaderRef}
              className="ml-2 text-xs text-center text-gray-400 mt-2"
            >
              {loading ? "Loading..." : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
