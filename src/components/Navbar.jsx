import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [activeId, setActiveId] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [overHero, setOverHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const activeBox = useRef(null);
  const navRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // SCROLL EFFECT
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);

    // also detect when navbar has passed the hero section
    const onScrollHero = () => {
      try {
        const hero = document.querySelector("section");
        if (!hero) return setOverHero(false);
        const heroBottom = hero.getBoundingClientRect().bottom;
        // nav height ~56px; when hero bottom is <= nav height, we've crossed it
        setOverHero(heroBottom <= 56);
      } catch (e) {
        setOverHero(false);
      }
    };

    window.addEventListener("scroll", onScrollHero);

    // run once to set initial state
    onScroll();
    onScrollHero();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScrollHero);
    };
  }, []);

  // AUTH + ROLE CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setRole(null);
      return;
    }

    setIsLoggedIn(true);

    axiosInstance
      .get("/auth/is-admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRole(res.data.admin ? "ADMIN" : "USER");
      })
      .catch(() => {
        setRole("USER");
      });
  }, []);

  // ACTIVE TAB SYNC
  useEffect(() => {
     const path = location.pathname.replace(/^\/+/, "");

    // If on homepage, allow location.state.scrollTo to set the active pill (top-recipes, contact)
    if (path === "") {
      if (location.state && location.state.scrollTo) {
        setActiveId(location.state.scrollTo);
        return;
      }
      setActiveId("home");
      return;
    }

    // /recipes or /recipes/:id
    if (path.startsWith("recipes")) {
      setActiveId("recipes");
      return;
    }

    // admin routes (e.g., admin/users, admin/add-recipe)
    if (path.startsWith("admin/")) {
      const parts = path.split("/");
      const sub = parts[1] || "";
      if (sub === "users") setActiveId("users");
      else if (sub === "add-recipe") setActiveId("add-recipe");
      else setActiveId("home");
      return;
    }

    if (path === "login") setActiveId("login");
    else if (path === "signup") setActiveId("signup");
    else if (path === "contact") setActiveId("contact");
    else if (path === "profile") setActiveId("profile");
  }, [location.pathname, location.state]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/login");
  };

  const handleHomeClick = () => {
    if (location.pathname !== "/") navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveId("home");
    setMenuOpen(false);
  };

  const handleContactClick = () => {
    if (location.pathname !== "/") {
      // navigate with state so active-pill can pick this up after navigation
      navigate("/", { state: { scrollTo: "contact" } });
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    } else {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
    setActiveId("contact");
    setMenuOpen(false);
  };

  const handleTopRecipesClick = () => {
    if (location.pathname !== "/") navigate("/", { state: { scrollTo: "top-recipes" } });
    setTimeout(() => {
      document.getElementById("top-recipes")?.scrollIntoView({ behavior: "smooth" });
    }, 400);
    setActiveId("top-recipes");
    setMenuOpen(false);
  };

  const centerNavItems =
    role === "ADMIN"
      ? [
          { label: "Home", id: "home", action: handleHomeClick },
          { label: "Recipes", to: "/recipes", id: "recipes" },
          { label: "Top Recipes", id: "top-recipes", action: handleTopRecipesClick },
          { label: "Users", to: "/admin/users", id: "users" },
          { label: "Add Recipe", to: "/admin/add-recipe", id: "add-recipe" },
          { label: "Contact", id: "contact", action: handleContactClick },
        ]
      : [
          { label: "Home", id: "home", action: handleHomeClick },
          { label: "Recipes", to: "/recipes", id: "recipes" },
          { label: "Top Recipes", id: "top-recipes", action: handleTopRecipesClick },
          { label: "Contact", id: "contact", action: handleContactClick },
        ];

  // ACTIVE PILL
  useEffect(() => {
    if (!navRef.current || !activeBox.current) return;

    const activeLink = navRef.current.querySelector(
      `.nav-link[data-id="${activeId}"]`
    );

    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink;
      activeBox.current.style.left = `${offsetLeft}px`;
      activeBox.current.style.width = `${offsetWidth}px`;
      activeBox.current.style.opacity = "1";
    } else {
      activeBox.current.style.opacity = "0";
    }
  }, [activeId]);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        overHero
          ? "bg-gradient-to-b from-emerald-700/95 via-emerald-600/90 to-emerald-500/80"
          : scrolled
          ? "bg-gradient-to-b from-black/95 via-black/80 to-black/60"
          : "bg-gradient-to-b from-black/80 via-black/50 to-transparent"
      }`}
    >
      <div className="relative flex items-center justify-between h-[56px] px-5 md:px-8">
        <button onClick={handleHomeClick} className="text-white font-semibold text-base">
          Amma Delightz
        </button>
        <div
          ref={navRef}
          className="hidden md:flex absolute left-1/2 -translate-x-1/2
                     items-center gap-1 rounded-full
                     h-[38px] px-2
                     bg-black/50 backdrop-blur-xl
                     border border-white/20 shadow-lg"
        >
          <span
            ref={activeBox}
            className="absolute left-0 top-1 bottom-1 rounded-full
                       bg-emerald-400/40
                       transition-all duration-300 ease-out opacity-0 -z-10"
          />

          {centerNavItems.map(({ label, to, id, action }) =>
            action ? (
              <button
                key={id}
                data-id={id}
                onClick={action}
                className={`nav-link inline-flex items-center justify-center h-full px-4 text-sm font-medium whitespace-nowrap ${
                  activeId === id ? "text-white" : "text-white/80 hover:text-white"
                }`}
              >
                {label}
              </button>
            ) : (
              <Link
                key={id}
                to={to}
                data-id={id}
                className={`nav-link inline-flex items-center justify-center h-full px-4 text-sm font-medium whitespace-nowrap ${
                  activeId === id ? "text-white" : "text-white/80 hover:text-white"
                }`}
              >
                {label}
              </Link>
            )
          )}
        </div>
        <div className="hidden md:flex gap-3">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="h-[36px] px-5 rounded-full text-white border border-white/40 flex items-center justify-center">
                Login
              </Link>
              <Link to="/signup" className="h-[36px] px-5 rounded-full text-white border border-white/40 flex items-center justify-center">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="h-[36px] px-5 flex items-center justify-center
                           rounded-full text-sm font-medium
                           text-white border border-emerald-400
                           hover:bg-emerald-400/30 transition"
              >
                View Profile
              </Link>
              <button
                onClick={handleLogout}
                className="h-[36px] px-5 flex items-center justify-center
                           rounded-full text-sm font-medium
                           text-white border border-white/40
                           hover:bg-red-500/40 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-xl"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black/90 px-6 py-4 space-y-3">
          {centerNavItems.map(({ label, to, id, action }) =>
            action ? (
              <button key={id} onClick={action} className="block text-white w-full text-left">
                {label}
              </button>
            ) : (
              <Link key={id} to={to} onClick={() => setMenuOpen(false)} className="block text-white">
                {label}
              </Link>
            )
          )}

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="block text-white">Login</Link>
              <Link to="/signup" className="block text-white">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="block text-white">View Profile</Link>
              <button onClick={handleLogout} className="block text-white">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
