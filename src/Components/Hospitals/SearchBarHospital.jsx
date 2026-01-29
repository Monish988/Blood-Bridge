import { Search } from "lucide-react";
const SearchBarHospital = ({ search, setSearch }) => {
  return (
    <div className="bg-white shadow p-3 md:p-4 rounded-lg">
      <div className="border flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg">
        <Search size={18} className="flex-shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm md:text-base"
          placeholder="Search hospitals by name or city..."
        />
      </div>
    </div>
  );
};
export default SearchBarHospital;