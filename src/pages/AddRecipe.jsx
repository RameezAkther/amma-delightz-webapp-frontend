import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";

export default function AddRecipe() {
  const navigate = useNavigate();
  const location = useLocation();

  const isEdit = location.state?.edit === true;
  const editingId = location.state?.recipe?.id || null; // we only really need the id

  const [pageLoading, setPageLoading] = useState(isEdit); // for initial load when editing
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ================= BASIC INFO =================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [category, setCategory] = useState("");

  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [servings, setServings] = useState("");

  const [tags, setTags] = useState("");
  const [creatorName, setCreatorName] = useState("");

  // ================= DYNAMIC FIELDS =================
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "", notes: "" },
  ]);
  const [steps, setSteps] = useState([""]);
  const [imageUrls, setImageUrls] = useState([""]);

  // ================= LOAD FULL RECIPE WHEN EDITING =================
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!isEdit || !editingId) return;

      try {
        setPageLoading(true);
        const res = await axiosInstance.get(`/recipes/${editingId}`);
        const r = res.data;

        setTitle(r.title || "");
        setDescription(r.description || "");
        setCuisine(r.cuisine || "");
        setCategory(r.category || "");

        setPrepTime(
          r.prepTime !== undefined && r.prepTime !== null
            ? String(r.prepTime)
            : ""
        );
        setCookTime(
          r.cookTime !== undefined && r.cookTime !== null
            ? String(r.cookTime)
            : ""
        );
        setTotalTime(
          r.totalTime !== undefined && r.totalTime !== null
            ? String(r.totalTime)
            : ""
        );
        setServings(
          r.servings !== undefined && r.servings !== null
            ? String(r.servings)
            : ""
        );

        setTags(r.tags && r.tags.length ? r.tags.join(", ") : "");
        setCreatorName(r.createdBy?.name || "");

        setIngredients(
          r.ingredients && r.ingredients.length
            ? r.ingredients.map((ing) => ({
                name: ing.name || "",
                quantity: ing.quantity ?? "",
                unit: ing.unit ?? "",
                notes: ing.notes ?? "",
              }))
            : [{ name: "", quantity: "", unit: "", notes: "" }]
        );

        setSteps(r.steps && r.steps.length ? [...r.steps] : [""]);

        setImageUrls(
          r.imageUrl && r.imageUrl.length ? [...r.imageUrl] : [""]
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe for editing.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchRecipe();
  }, [isEdit, editingId]);

  // ================= HANDLERS =================
  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: "", quantity: "", unit: "", notes: "" },
    ]);
  };

  const handleStepChange = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const handleImageChange = (index, value) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, ""]);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const recipeData = {
        title,
        description,
        cuisine,
        category,
        ingredients,
        steps,
        prepTime: prepTime ? Number(prepTime) : 0,
        cookTime: cookTime ? Number(cookTime) : 0,
        totalTime: totalTime ? Number(totalTime) : 0,
        servings: servings ? Number(servings) : 0,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
        createdBy: { name: creatorName },
        imageUrl: imageUrls.filter((url) => url.trim().length > 0),
      };

      if (isEdit && editingId) {
        await axiosInstance.put(`/recipes/${editingId}`, recipeData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Recipe updated successfully!");
        navigate(`/recipes/${editingId}`);
      } else {
        await axiosInstance.post("/recipes", recipeData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Recipe added successfully!");
        navigate("/recipes");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save recipe.");
    } finally {
      setSaving(false);
    }
  };

  // ================= RENDER =================
  if (pageLoading) {
    return (
      <div className="pt-28 text-center text-gray-600">
        Loading recipe details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-28 pb-16 px-4">
      <div className="bg-white rounded-xl shadow-md px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {isEdit ? "Edit Recipe" : "Add New Recipe"}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {isEdit
                ? "Update the recipe details and save changes."
                : "Share your favourite Amma-style recipe with the community."}
            </p>
          </div>
        </div>

        {error && (
          <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Recipe Title <span className="text-red-500">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Curd Rice"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Created By <span className="text-red-500">*</span>
              </label>
              <input
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Mom"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={4}
              placeholder="A refreshing South Indian dish made with rice, curd, and tempered spices..."
              required
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1">Cuisine</label>
              <input
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full border p-3 rounded-md"
                placeholder="South Indian"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border p-3 rounded-md"
                placeholder="Main Course"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Prep Time (mins)</label>
              <input
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full border p-3 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Cook Time (mins)</label>
              <input
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                className="w-full border p-3 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Total Time (mins)</label>
              <input
                type="number"
                value={totalTime}
                onChange={(e) => setTotalTime(e.target.value)}
                className="w-full border p-3 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Servings</label>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="w-full border p-3 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Tags</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full border p-3 rounded-md"
              placeholder="vegetarian, rice, South Indian"
            />
          </div>

          {/* INGREDIENTS */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800">Ingredients</h2>
              <button
                type="button"
                onClick={addIngredient}
                className="text-sm text-emerald-700 hover:underline"
              >
                + Add Ingredient
              </button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ing, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 md:grid-cols-4 gap-2"
                >
                  <input
                    placeholder="Name"
                    value={ing.name}
                    onChange={(e) =>
                      handleIngredientChange(index, "name", e.target.value)
                    }
                    className="border p-2 rounded-md"
                  />
                  <input
                    placeholder="Quantity"
                    value={ing.quantity}
                    onChange={(e) =>
                      handleIngredientChange(index, "quantity", e.target.value)
                    }
                    className="border p-2 rounded-md"
                  />
                  <input
                    placeholder="Unit"
                    value={ing.unit}
                    onChange={(e) =>
                      handleIngredientChange(index, "unit", e.target.value)
                    }
                    className="border p-2 rounded-md"
                  />
                  <input
                    placeholder="Notes"
                    value={ing.notes}
                    onChange={(e) =>
                      handleIngredientChange(index, "notes", e.target.value)
                    }
                    className="border p-2 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* STEPS */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800">Steps</h2>
              <button
                type="button"
                onClick={addStep}
                className="text-sm text-emerald-700 hover:underline"
              >
                + Add Step
              </button>
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <textarea
                  key={index}
                  value={step}
                  onChange={(e) =>
                    handleStepChange(index, e.target.value)
                  }
                  className="w-full border p-2 rounded-md"
                  rows={3}
                  placeholder={`Step ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* IMAGES */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800">Image URLs</h2>
              <button
                type="button"
                onClick={addImageUrl}
                className="text-sm text-emerald-700 hover:underline"
              >
                + Add Image
              </button>
            </div>

            <div className="space-y-2">
              {imageUrls.map((img, index) => (
                <input
                  key={index}
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="w-full border p-2 rounded-md"
                  placeholder="Paste image URL"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {saving
              ? isEdit
                ? "Updating..."
                : "Adding..."
              : isEdit
              ? "Update Recipe"
              : "Add Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
}
