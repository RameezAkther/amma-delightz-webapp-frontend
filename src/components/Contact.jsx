import React from "react";

const socialLinks = [
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
  },
  {
    href: "https://www.youtube.com/",
    label: "YouTube",
  },
  {
    href: "https://www.facebook.com/",
    label: "Facebook",
  },
  {
    href: "https://www.pinterest.com/",
    label: "Pinterest",
  },
];

const Contact = () => {
  return (
    <section id="contact" className="bg-white text-gray-800 py-16">
      {/* Decorative squiggle to separate sections */}
      <svg
        className="w-full -mt-8 mb-6 text-emerald-600"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M0,40 C180,0 360,80 540,40 C720,0 900,80 1080,40 C1260,0 1440,80 1440,40"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="container mx-auto px-4 lg:grid lg:grid-cols-2 lg:items-start gap-10">

        {/* ================= LEFT : CONTENT ================= */}
        <div className="mb-8 lg:mb-0 flex flex-col">
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-emerald-800 max-w-[18ch]">
            Contact Amma Delightz
          </h2>

          <p className="text-gray-600 mt-4 mb-8 max-w-[56ch]">
            Have a recipe to share, a question about our dishes, or want to
            collaborate with us? We’d love to hear from you — share your
            ideas and let’s cook something delicious together.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3 mt-4">
            {socialLinks.map(({ href, label }, key) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200
                           text-sm text-emerald-700 bg-white shadow-sm
                           transition hover:bg-emerald-50"
                aria-label={label}
              >
                {/* Icon */}
                {label === "Instagram" && (
                  <svg className="w-5 h-5 text-emerald-700" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm8 4a1 1 0 110 2 1 1 0 010-2zm-5 2.5A4.5 4.5 0 1014.5 13 4.505 4.505 0 0010 8.5zm0 2A2.5 2.5 0 1112.5 13 2.503 2.503 0 0110 10.5z" />
                  </svg>
                )}

                {label === "YouTube" && (
                  <svg className="w-5 h-5 text-emerald-700" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M23.498 6.186a2.997 2.997 0 00-2.11-2.12C19.587 3.5 12 3.5 12 3.5s-7.587 0-9.388.566A2.997 2.997 0 00.502 6.186 31.02 31.02 0 000 12a31.02 31.02 0 00.502 5.814 2.997 2.997 0 002.11 2.12C4.413 20.5 12 20.5 12 20.5s7.587 0 9.388-.566a2.997 2.997 0 002.11-2.12A31.02 31.02 0 0024 12a31.02 31.02 0 00-.502-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                  </svg>
                )}

                {label === "Facebook" && (
                  <svg className="w-5 h-5 text-emerald-700" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M22 12a10 10 0 10-11.5 9.95v-7.05h-2.2V12h2.2V9.8c0-2.17 1.3-3.36 3.28-3.36.95 0 1.95.17 1.95.17v2.14h-1.09c-1.07 0-1.4.67-1.4 1.36V12h2.38l-.38 2.9h-2v7.05A10 10 0 0022 12z" />
                  </svg>
                )}

                {label === "Pinterest" && (
                  <svg className="w-5 h-5 text-emerald-700" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.084 2.398 7.591 5.854 9.083-.081-.773-.155-1.959.032-2.803.169-.74 1.087-4.71 1.087-4.71s-.278-.556-.278-1.38c0-1.292.749-2.257 1.684-2.257.795 0 1.18.596 1.18 1.312 0 .8-.51 1.994-.774 3.103-.222.93.468 1.687 1.387 1.687 1.664 0 2.946-1.754 2.946-4.288 0-2.24-1.611-3.803-3.907-3.803-2.659 0-4.213 1.993-4.213 4.045 0 .802.308 1.664.693 2.132a.28.28 0 01.064.27c-.07.296-.228.93-.26 1.06-.041.178-.134.216-.31.131-1.158-.538-1.88-2.22-1.88-3.58C5.02 7.03 8.58 4 12.5 4c3.748 0 6.5 2.622 6.5 6.15 0 3.655-2.293 6.599-5.49 6.599-1.07 0-2.078-.556-2.422-1.21l-.66 2.517C9.46 20.92 10.66 21.5 12 21.5 17.523 21.5 22 17.023 22 12S17.523 2 12 2z" />
                  </svg>
                )}

                <span className="hidden sm:inline">{label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ================= RIGHT : FORM ================= */}
        <form
          action="https://getform.io/f/bzynrena"
          method="POST"
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

            <div>
              <label htmlFor="name" className="block text-sm mb-1 text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder="Your name"
                className="w-full px-4 py-2 rounded-md bg-white
                           border border-gray-200 text-sm
                           text-gray-800 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-1 text-gray-700">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-md bg-white
                           border border-gray-200 text-sm
                           text-gray-800 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>

          </div>

          <div className="mb-5">
            <label htmlFor="message" className="block text-sm mb-1 text-gray-700">
              Your Message
            </label>
            <textarea
              name="message"
              id="message"
              rows="4"
              required
              placeholder="Ask about recipes, collaborations, feedback..."
              className="w-full px-4 py-2 rounded-md bg-white
                         border border-gray-200 text-sm
                         text-gray-800 placeholder-gray-400 resize-none
                         focus:outline-none focus:ring-2 focus:ring-emerald-300"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-emerald-600
                       hover:bg-emerald-700 transition
                       text-sm font-semibold text-white"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
