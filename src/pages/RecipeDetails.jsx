import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function RecipeDetails() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0); // ✅ MOVED HERE

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axiosInstance.get(`/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        setError("Failed to load recipe details");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  if (!recipe)
    return <p className="text-center mt-10 text-gray-600">No data found</p>;

  const images =
    recipe.imageUrl && recipe.imageUrl.length ? recipe.imageUrl : [];

  const prev = () =>
    setCurrent((c) => (c <= 0 ? images.length - 1 : c - 1));

  const next = () =>
    setCurrent((c) => (c >= images.length - 1 ? 0 : c + 1));


  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Gallery */}
        <div className="md:col-span-1">
          <div className="relative rounded-xl overflow-hidden shadow">
            {images.length > 0 ? (
              <>
                <img src={images[current]} alt={`${recipe.title} ${current + 1}`} className="w-full h-80 object-cover" />

                {/* nav buttons */}
                {images.length > 1 && (
                  <>
                    <button onClick={prev} aria-label="Previous image" className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60">
                      ‹
                    </button>
                    <button onClick={next} aria-label="Next image" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60">
                      ›
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-80 bg-gray-100 flex items-center justify-center text-gray-400 italic">No Image Available</div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border ${i === current ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-200'}`}>
                  <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-3 text-gray-800">{recipe.title}</h1>
          <p className="text-gray-600 mb-4 italic">{recipe.description}</p>

          <div className="flex flex-wrap gap-3 items-center mb-6">
            <span className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded">{recipe.cuisine || 'Cuisine'}</span>
            <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded">{recipe.category || 'Category'}</span>
            <span className="text-sm text-gray-600">⏱️ {recipe.totalTime || 0} min</span>
            <span className="text-sm text-gray-600">👨‍👩‍👧 {recipe.servings || '-'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-green-700">🧂 Ingredients</h2>
              <ul className="space-y-2 text-gray-700">
                {recipe.ingredients.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="text-sm text-gray-500 mt-1">•</div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.quantity} {item.unit} {item.notes ? ` · ${item.notes}` : ''}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-green-700">👩‍🍳 Steps</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                {recipe.steps.map((step, idx) => (
                  <li key={idx} className="text-gray-700">{step}</li>
                ))}
              </ol>
            </div>
          </div>

          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-green-700">🏷️ Tags</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, idx) => (
                  <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600 border-t pt-4 mt-6">
            <p>👩‍🍳 Created by: <b>{recipe.createdBy?.name || 'Unknown'}</b></p>
            <p>📅 Created on: {recipe.createdAt ? new Date(recipe.createdAt).toLocaleDateString() : '-'}</p>
            <p>⭐ Rating: {recipe.averageRating ? Number(recipe.averageRating).toFixed(1) : '—'} {recipe.ratingsCount ? `(${recipe.ratingsCount} reviews)` : ''}</p>
            <p>❤️ Favorites: {recipe.favoritesCount ?? 0}</p>
            <p>👁️ Views: {recipe.views ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
