const Unit = ({ bg, units }) => {
  return (
    <div className={`bg-white w-48 shadow flex flex-col items-center py-4 rounded-lg hover:ring hover:ring-gray-500 ${units<3?'ring ring-red-500':''}`}>
      <div className="text-red-700 bg-red-100 mt-2 px-6 py-3 rounded-full">
        <h2 className="text-lg font-bold">{bg}</h2>
      </div>
      <h2 className="font-bold text-3xl">{units}</h2>
      <p className="text-gray-500">units</p>
      {units<3&&(
        <p className="text-red-500 font-bold text-sm" >LOW</p>
      )}
    </div>
  );
};
export default Unit;