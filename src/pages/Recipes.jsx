import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import RecipeCard from "../components/RecipeCard";
import Footer from "../components/Footer";
import Contact from "../components/Contact";

export default function Recipes() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Normal Pagination
  const [page, setPage] = useState(1);
  const limit = 9;
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Favorites Pagination
  const [favPage, setFavPage] = useState(1);
  const [favPages, setFavPages] = useState(1);

  // ✅ Filters & Search
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientQuery, setIngredientQuery] = useState("");

  const [cuisine, setCuisine] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  // ✅ Load Admin Role
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axiosInstance
      .get("/auth/is-admin", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setIsAdmin(res.data.isAdmin === true))
      .catch(() => setIsAdmin(false));
  }, []);

  // ✅ Load Favorite IDs
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axiosInstance
      .get(`/favorites/${userId}`)
      .then((res) => setFavoriteIds(res.data.map((f) => f.recipeId)))
      .catch(() => setFavoriteIds([]));
  }, []);

  // ✅ Fetch Normal Recipes
  useEffect(() => {
    if (onlyFavorites) return;

    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        if (searchQuery) params.set("q", searchQuery);
        if (ingredientQuery) params.set("ingredient", ingredientQuery);
        if (cuisine) params.set("cuisine", cuisine);
        if (category) params.set("category", category);
        if (sort) params.set("sort", sort);

        const res = await axiosInstance.get(`/recipes?${params.toString()}`);

        setRecipes(res.data.recipes);
        setTotalPages(res.data.pages);
      } catch {
        setError("Failed to fetch recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [page, searchQuery, ingredientQuery, cuisine, category, sort, onlyFavorites]);

  // ✅ Fetch Paginated Favorites
  const fetchFavoriteRecipes = async (pageNumber = 1) => {
    const userId = localStorage.getItem("userId");

    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.get(
        `/favorites/${userId}/paged?page=${pageNumber}&limit=9`
      );

      const fetchedFavorites = res.data.recipes || [];
      const extractedRecipes = fetchedFavorites.map((f) => f.recipe || f);
      setRecipes(extractedRecipes);
      setFavPages(res.data.pages);
      setFavPage(res.data.page);
      setOnlyFavorites(true);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch favorite recipes");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle Favorites Filter
  const toggleOnlyFavorites = async () => {
    const next = !onlyFavorites;
    setOnlyFavorites(next);

    if (next) {
      await fetchFavoriteRecipes(1);
    } else {
      setPage(1);
      setSearchQuery("");
      setIngredientQuery("");
    }
  };

  // ✅ Toggle Favorite Add / Remove
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

        if (onlyFavorites) {
          setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
        }
      }
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  // ✅ Button Search
  const handleSearch = () => {
    setPage(1);
    setSearchQuery(searchInput);
    setIngredientQuery(ingredientInput);
  };

  if (loading) return <p className="mt-24 text-center">Loading...</p>;
  if (error) return <p className="mt-24 text-center text-red-500">{error}</p>;

  const cuisineOptions = ["South Indian", "North Indian", "Chinese", "Italian"];
  const categoryOptions = ["Main Course", "Breakfast", "Snack", "Dessert"];

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        <h1 className="text-3xl font-bold text-center mb-6">All Recipes</h1>

        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          <div className="flex flex-col gap-2 w-full md:w-2/3">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title/description"
              className="px-4 py-2 border rounded-full"
            />
            <input
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              placeholder="Search by ingredient"
              className="px-4 py-2 border rounded-full"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center justify-end">
            <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} className="px-3 py-2 border rounded-full">
              <option value="">All Cuisines</option>
              {cuisineOptions.map((c) => <option key={c}>{c}</option>)}
            </select>

            <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 border rounded-full">
              <option value="">All Categories</option>
              {categoryOptions.map((c) => <option key={c}>{c}</option>)}
            </select>

            <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 border rounded-full">
              <option value="">Default</option>
              <option value="rating">Rating</option>
              <option value="views">Views</option>
              <option value="newest">Newest</option>
            </select>

            <button onClick={handleSearch} className="bg-green-700 text-white px-6 py-2 rounded-full">
              Search
            </button>
          </div>
        </div>

        {/* FAVORITES FILTER */}
        <div className="flex justify-end mb-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyFavorites} onChange={toggleOnlyFavorites} />
            Only Favorites
          </label>
        </div>

        {/* RECIPES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {recipes.map((recipe) => (
            <div key={recipe.id}>
              <RecipeCard
                recipe={recipe}
                showButton
                isFavorited={favoriteIds.includes(recipe.id)}
                onToggleFavorite={(id, isFav) => toggleFavorite(id, isFav)}
              />

              {isAdmin && (
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    onClick={() => navigate("/admin/add-recipe", { state: { edit: true, recipe } })}
                    className="px-3 py-1 bg-amber-600 text-white rounded"
                  >
                    Update
                  </button>

                  <button
                    onClick={async () => {
                      if (!window.confirm("Delete this recipe?")) return;
                      const token = localStorage.getItem("token");
                      await axiosInstance.delete(`/recipes/${recipe.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      setRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ✅ PAGINATION */}
        {!onlyFavorites && (
          <div className="flex justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-full ${page === i + 1 ? "bg-green-700 text-white" : "border"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* ✅ FAVORITES PAGINATION */}
        {onlyFavorites && (
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(favPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => fetchFavoriteRecipes(i + 1)}
                className={`w-10 h-10 rounded-full ${favPage === i + 1 ? "bg-green-700 text-white" : "border"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <Contact />
      <Footer />
    </>
  );
}

