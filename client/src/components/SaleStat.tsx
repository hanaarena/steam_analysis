export default function SaleStat(id: { id: number | string }) {
  return (
    <div className="container-sale-stat mb-4">
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold">Game Sale Stat</h1>
      </header>

      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded shadow">
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Price:</span> $24.99
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Reviews:</span> 444
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Followers:</span> 20,934
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Avg Playtime:</span> 9.75 hours
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Review Score:</span> 89%
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Genres:</span> Action, RPG, Strategy,
          Early Access
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Copies sold:</span> 19,374
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Owners:</span> 20,481
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-bold">Revenue:</span> $394,097
        </p>
      </div>
    </div>
  );
}
