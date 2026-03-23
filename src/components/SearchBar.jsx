// export default function SearchBar({
//   city,
//   setCity,
//   runSearch,
//   loading,
//   fetchSuggestions,
//   suggestions,
//   setSuggestions,
//   //   selectedPlace,
//   setSelectedPlace,
//   inputRef,
// }) {
//   return (
//     <div className="row" style={{ marginTop: 12, position: "relative" }}>
//       <input
//         ref={inputRef}
//         placeholder="Type a city…"
//         value={city}
//         onChange={(e) => {
//           setCity(e.target.value);
//           setSelectedPlace(null); //
//           fetchSuggestions(e.target.value);
//         }}
//         onKeyDown={(e) => {
//           if (e.key === "Enter") runSearch(city);
//         }}
//       />
//       <button
//         onClick={() => runSearch(city)}
//         disabled={loading || !city.trim()}
//       >
//         {loading ? "Searching..." : "Search"}
//       </button>
//       <button
//         className="secondary"
//         disabled={loading}
//         onClick={() => {
//           setCity("Aleppo");
//           setSelectedPlace(null);
//           runSearch("Aleppo");
//         }}
//       >
//         Use Aleppo
//       </button>

//       {suggestions.length > 0 && (
//         <div className="suggestions">
//           {suggestions.map((s, i) => (
//             <div
//               key={i}
//               onClick={() => {
//                 setCity(`${s.name}, ${s.country}`);
//                 setSelectedPlace(s);
//                 setSuggestions([]);
//                 runSearch(s.name);
//               }}
//               className="suggestion-item"
//               onMouseOver={(e) => e.currentTarget.classList.add("hovered")}
//               onMouseOut={(e) => e.currentTarget.classList.remove("hovered")}
//             >
//               {s.name}, {s.country}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
