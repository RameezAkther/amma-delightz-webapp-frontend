import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Hero from "../components/Hero";
import RecipeCard from "../components/RecipeCard";
import Footer from "../components/Footer";
import Contact from "../components/Contact";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
      <Contact />
      <Footer />
    </>
  );
}
