export default function Page() {
  return (
    <div>
      <h1 className="pb-3 font-bold text-2xl">Uploads Dashboard</h1>

      <input
        type="file"
        className="text-gray-700 text-sm file:bg-gray-400 hover:file:bg-gray-600 file:text-white file:py-2 file:px-4 file:rounded-lg file:cursor-pointer"
      />
    </div>
  );
}
