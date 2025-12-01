import React from "react";
import { ButtonPrimary } from "./Button";

const sitemap = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Recipes", href: "#recipes" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "YouTube", href: "https://www.youtube.com/" },
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "Pinterest", href: "https://www.pinterest.com/" },
];

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 pt-12 pb-8 overflow-hidden border-t border-gray-200">
      <div className="container mx-auto px-4">

        {/* ================= TOP SECTION ================= */}
        <div className="lg:grid lg:grid-cols-2 items-start">

          {/* ================= LEFT : CTA ================= */}
          <div className="mb-8">
            <div className="bg-emerald-50 rounded-xl p-6 sm:p-8 shadow-sm max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mb-3">
                Let’s Cook Something Delicious Together
              </h2>
              <p className="text-gray-600 mb-4">Share your recipes and inspire other home cooks.</p>

              <div>
                <ButtonPrimary
                  href="mailto:support@ammadelightz.com"
                  label="Share Your Recipe"
                  icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    }
                />
              </div>
            </div>
          </div>

          {/* ================= RIGHT : LINKS ================= */}
          <div className="grid grid-cols-2 gap-6 lg:pl-20">

            {/* Sitemap */}
            <div>
              <p className="mb-3 text-lg font-semibold text-emerald-700">
                Sitemap
              </p>
              <ul>
                {sitemap.map(({ label, href }, key) => (
                  <li key={key}>
                    <a
                      href={href}
                      className="block text-sm text-gray-600 py-1 transition-colors hover:text-emerald-700"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socials */}
            <div>
              <p className="mb-3 text-lg font-semibold text-emerald-700">
                Follow Us
              </p>
              <ul>
                {socials.map(({ label, href }, key) => (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-sm text-gray-600 py-1 transition-colors hover:text-emerald-700"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4 border-t border-gray-100 mt-8">

          {/* Brand */}
          <a href="/" className="logo flex items-center gap-3">
            <span className="text-lg font-semibold text-emerald-700">
              Amma Delightz
            </span>
            <span className="hidden sm:inline text-sm text-gray-500">— Homemade recipes, simple ingredients</span>
          </a>

          {/* Copyright */}
          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} Amma Delightz. Made with love for food lovers.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
