import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import Hero from "../components/Hero";
import RecipeCard from "../components/RecipeCard";
import Footer from "../components/Footer";
import Contact from "../components/Contact";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load Favorite IDs
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axiosInstance
      .get(`/favorites/${userId}`)
      .then((res) => setFavoriteIds(res.data.map((f) => f.recipeId)))
      .catch(() => setFavoriteIds([]));
  }, []);

  const toggleFavorite = async (recipeId, isFav) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return toast.error("Login required");

    try {
      if (!isFav) {
        await axiosInstance.post("/favorites", { userId, recipeId });
        setFavoriteIds((prev) => [...prev, recipeId]);
      } else {
        await axiosInstance.delete("/favorites", {
          data: { userId, recipeId },
        });
        setFavoriteIds((prev) => prev.filter((id) => id !== recipeId));
      }
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axiosInstance.get("/recipes/homepage");
        setRecipes(response.data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError("Failed to load recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <>
      <Hero />

      <section id="top-recipes" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Top Recipes
        </h2>

        {loading && <p className="text-center text-gray-600">Loading recipes...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorited={favoriteIds.includes(recipe.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>
      <Contact />
      <Footer />
    </>
  );
}
