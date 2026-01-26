import { Search } from "lucide-react";
const SearchBarHospital = ({ search, setSearch }) => {
  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <div className="border flex items-center gap-3 p-3 rounded-lg">
        <Search />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none"
          placeholder="Search hospitals by name or city..."
        />
      </div>
    </div>
  );
};
export default SearchBarHospital;