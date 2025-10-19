import { useRef, useState } from "react";
import "./App.css";
import ReviewsChart from "./components/ReviewChart";
import SaleStat from "./components/SaleStat";
import EmptyTip from "./components/EmptyTip";
import { get } from "@lanz/utils";
import { Button } from "@mantine/core";
import UpdateNews from "./components/UpdateNews";

const apiEndpoint = import.meta.env.VITE_STEAM;

export default function App() {
  const [appId, setAppId] = useState("");
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState<GameDetail>({} as unknown as GameDetail);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const inputId = inputRef.current?.value;
    if (!inputId || isNaN(+inputId)) return;

    setLoading(true);
    // already modify app_id will trasfer to children components
    setAppId(inputId);
    const res = await get<
      Record<string, { data: GameDetail; success: boolean }>
    >(`${apiEndpoint}/appdetails?appids=${inputId}`);
    if (res[inputId] && res[inputId].success) {
      setLoading(false);
      setGame(res[inputId].data);
    }
  };

  return (
    <div className="w-11/12 flex flex-col justify-center my-0 mx-auto">
      <div className="my-2 mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex items-center"
        >
          App ID: &nbsp;
          <input
            ref={inputRef}
            className="border indent-2 mr-2"
            type="text"
            name="input_id"
          />
          <Button
            type="submit"
            size="xs"
            variant="light"
            loading={loading}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </form>
      </div>
      {game.steam_appid ? (
        <>
          <div className="header w-full flex gap-4 mb-6">
            <div className="cover w-1/3">
              <img className="max-w-full h-auto" src={game.header_image} />
            </div>
            <div className="desp flex-1 w-1/3">
              <p className="font-bold text-lg text-blue-400">
                <a
                  href={`https://store.steampowered.com/app/${appId}`}
                  target="_blank"
                  className="underline"
                >
                  {game.name} ({appId})
                </a>
              </p>
              <p className="text-sm mb-2">
                <span className="mr-4">
                  Developer: {game.developers.join(",")}
                </span>
                <span>Publisher: {game.publishers.join(",")}</span>
              </p>
              <p
                className="max-h-[7.8em] multi-line-ellipsis"
                dangerouslySetInnerHTML={{ __html: game.about_the_game }}
              />
            </div>
          </div>
          <div className="content">
            <SaleStat id={appId} />
            <UpdateNews id={appId} />
            <ReviewsChart id={appId} />
          </div>
        </>
      ) : (
        <EmptyTip
          title="No game selected"
          message="Enter an App ID above and click Submit to load game data."
        />
      )}
    </div>
  );
}
