import { useNavigate } from "react-router-dom";

export default function RecipeCard({ recipe, showButton = false, isFavorited = false, onToggleFavorite }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">

      {/* IMAGE */}
      <div className="h-40 bg-gray-100 flex items-center justify-center relative">
        {recipe.imageUrl && recipe.imageUrl.length > 0 ? (
          <img src={recipe.imageUrl[0]} alt={recipe.title} className="object-cover w-full h-full" />
        ) : (
          <span className="text-gray-400 italic">No Image</span>
        )}

        {/* ❤️ FAVORITE ICON TOGGLE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe.id, isFavorited);
          }}
          className={`absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition
            ${isFavorited ? "bg-red-100" : "bg-white/80 hover:bg-gray-100"}`}
        >
          {isFavorited ? "❤️" : "🤍"}
        </button>
      </div>

      {/* BODY */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{recipe.description}</p>

        {showButton && (
          <button
            onClick={() => navigate(`/recipes/${recipe.id}`)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
}
