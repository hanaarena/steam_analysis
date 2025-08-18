import "./App.css";

export default function App() {
  return (
    <div className="w-11/12 flex justify-center my-0 mx-auto">
      <div className="header w-full flex gap-4">
        <div className="cover flex-1">
          <img
            src="//shared.fastly.steamstatic.com/store_item_assets/steam/apps/570/header.jpg"
            alt=""
          />
        </div>
        <div className="desp flex-1">
          <p className="font-bold text-lg">Dota</p>
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
      <div className="content"></div>
    </div>
  );
}
