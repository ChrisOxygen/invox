"use client";

function DesignSystem() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Invox Design System
        </h1>

        {/* Color Palette */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Color Palette
          </h2>

          {/* Primary Colors */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Primary Colors
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-600 h-20 rounded-lg flex items-center justify-center">
                <span className="text-white font-medium">#2563eb</span>
              </div>
              <div className="bg-cyan-400 h-20 rounded-lg flex items-center justify-center">
                <span className="text-black font-medium">#00e5ff</span>
              </div>
            </div>
          </div>

          {/* Blue Shades */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Blue Variations
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <div className="bg-blue-50 h-16 rounded flex items-center justify-center">
                <span className="text-blue-800 text-xs">50</span>
              </div>
              <div className="bg-blue-100 h-16 rounded flex items-center justify-center">
                <span className="text-blue-800 text-xs">100</span>
              </div>
              <div className="bg-blue-200 h-16 rounded flex items-center justify-center">
                <span className="text-blue-800 text-xs">200</span>
              </div>
              <div className="bg-blue-400 h-16 rounded flex items-center justify-center">
                <span className="text-white text-xs">400</span>
              </div>
              <div className="bg-blue-600 h-16 rounded flex items-center justify-center">
                <span className="text-white text-xs">600</span>
              </div>
              <div className="bg-blue-800 h-16 rounded flex items-center justify-center">
                <span className="text-white text-xs">800</span>
              </div>
            </div>
          </div>

          {/* Cyan Shades */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Cyan Variations
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <div className="bg-cyan-50 h-16 rounded flex items-center justify-center">
                <span className="text-cyan-800 text-xs">50</span>
              </div>
              <div className="bg-cyan-100 h-16 rounded flex items-center justify-center">
                <span className="text-cyan-800 text-xs">100</span>
              </div>
              <div className="bg-cyan-200 h-16 rounded flex items-center justify-center">
                <span className="text-cyan-800 text-xs">200</span>
              </div>
              <div className="bg-cyan-400 h-16 rounded flex items-center justify-center">
                <span className="text-black text-xs">400</span>
              </div>
              <div className="bg-cyan-600 h-16 rounded flex items-center justify-center">
                <span className="text-white text-xs">600</span>
              </div>
              <div className="bg-cyan-800 h-16 rounded flex items-center justify-center">
                <span className="text-white text-xs">800</span>
              </div>
            </div>
          </div>

          {/* Neutral Colors */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Neutral Colors
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              <div className="bg-white h-16 rounded border-2 border-gray-200 flex items-center justify-center">
                <span className="text-gray-800 text-xs">White</span>
              </div>
              <div className="bg-gray-50 h-16 rounded flex items-center justify-center">
                <span className="text-gray-800 text-xs">50</span>
              </div>
              <div className="bg-gray-100 h-16 rounded flex items-center justify-center">
                <span className="text-gray-800 text-xs">100</span>
              </div>
              <div className="bg-gray-200 h-16 rounded flex items-center justify-center">
                <span className="text-gray-800 text-xs">200</span>
              </div>
              <div className="bg-gray-400 h-16 rounded flex items-center justify-center">
                <span className="text-white text-xs">400</span>
              </div>
              <div className="bg-gray-600 h-16 rounded flex items-center justify-center">
                <span className="text-white text-xs">600</span>
              </div>
              <div className="bg-gray-800 h-16 rounded flex items-center justify-center">
                <span className="text-white text-xs">800</span>
              </div>
              <div className="bg-black h-16 rounded flex items-center justify-center">
                <span className="text-white text-xs">Black</span>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Typography
          </h2>

          {/* Headings */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Headings</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border">
                <h1 className="text-4xl font-bold text-gray-900">
                  H1 - Heading 1
                </h1>
                <p className="text-sm text-gray-500 mt-1">text-4xl font-bold</p>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <h2 className="text-3xl font-bold text-gray-900">
                  H2 - Heading 2
                </h2>
                <p className="text-sm text-gray-500 mt-1">text-3xl font-bold</p>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-2xl font-semibold text-gray-900">
                  H3 - Heading 3
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  text-2xl font-semibold
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="text-xl font-semibold text-gray-900">
                  H4 - Heading 4
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  text-xl font-semibold
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <h5 className="text-lg font-medium text-gray-900">
                  H5 - Heading 5
                </h5>
                <p className="text-sm text-gray-500 mt-1">
                  text-lg font-medium
                </p>
              </div>
            </div>
          </div>

          {/* Body Text */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Body Text
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border">
                <p className="text-base text-gray-900">
                  Body Large - This is the primary body text used for most
                  content. It provides excellent readability and maintains the
                  clean, modern aesthetic of the Invox brand.
                </p>
                <p className="text-sm text-gray-500 mt-1">text-base</p>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <p className="text-sm text-gray-700">
                  Body Medium - This is used for secondary content, captions,
                  and supporting text. It&apos;s slightly smaller but maintains
                  good readability.
                </p>
                <p className="text-sm text-gray-500 mt-1">text-sm</p>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <p className="text-xs text-gray-600">
                  Body Small - Used for fine print, labels, and tertiary
                  information. Perfect for metadata and less prominent text.
                </p>
                <p className="text-sm text-gray-500 mt-1">text-xs</p>
              </div>
            </div>
          </div>

          {/* Italic Variations */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Italic Variations
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border">
                <p className="text-base italic text-gray-900">
                  Body Large Italic - Used for emphasis, quotes, or stylistic
                  text elements that need to stand out from regular body text.
                </p>
                <p className="text-sm text-gray-500 mt-1">text-base italic</p>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <p className="text-sm italic text-gray-700">
                  Body Medium Italic - Perfect for captions, emphasized
                  secondary text, or stylistic elements.
                </p>
                <p className="text-sm text-gray-500 mt-1">text-sm italic</p>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <p className="text-xs italic text-gray-600">
                  Body Small Italic - Used for fine print emphasis or stylistic
                  small text elements.
                </p>
                <p className="text-sm text-gray-500 mt-1">text-xs italic</p>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Colors in Typography */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Brand Typography
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border">
              <h1 className="text-4xl font-bold text-blue-600">
                Invox Blue Heading
              </h1>
              <p className="text-sm text-gray-500 mt-1">text-blue-600</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <h2 className="text-3xl font-bold text-cyan-400">
                Invox Cyan Heading
              </h2>
              <p className="text-sm text-gray-500 mt-1">text-cyan-400</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <p className="text-base text-blue-600">
                Body text in brand blue for highlighted content or important
                information.
              </p>
              <p className="text-sm text-gray-500 mt-1">text-blue-600</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <p className="text-base text-cyan-400">
                Body text in brand cyan for accent content or special callouts.
              </p>
              <p className="text-sm text-gray-500 mt-1">text-cyan-400</p>
            </div>
          </div>
        </section>

        {/* Material Bubble Buttons */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Material Bubble Buttons
          </h2>

          {/* Primary Gradient Buttons */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Primary Gradient Buttons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Large Button */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Primary Large
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Large size - py-3 px-6
                </p>
              </div>

              {/* Medium Button */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-2.5 px-5 rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Primary Medium
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Medium size - py-2.5 px-5
                </p>
              </div>

              {/* Small Button */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-2 px-4 rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm">
                  Primary Small
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Small size - py-2 px-4
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Outline Buttons */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Secondary Outline Buttons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Large Outline */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="w-full bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Secondary Large
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Outline large - border-2
                </p>
              </div>

              {/* Medium Outline */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="w-full bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white font-medium py-2.5 px-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Secondary Medium
                </button>
                <p className="text-xs text-gray-500 mt-2">Outline medium</p>
              </div>

              {/* Small Outline */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="w-full bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm">
                  Secondary Small
                </button>
                <p className="text-xs text-gray-500 mt-2">Outline small</p>
              </div>
            </div>
          </div>

          {/* Ghost/Text Buttons */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Ghost/Text Buttons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Large Ghost */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="w-full bg-transparent text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Ghost Large
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Ghost large - no border
                </p>
              </div>

              {/* Medium Ghost */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="w-full bg-transparent text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium py-2.5 px-5 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Ghost Medium
                </button>
                <p className="text-xs text-gray-500 mt-2">Ghost medium</p>
              </div>

              {/* Small Ghost */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="w-full bg-transparent text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm">
                  Ghost Small
                </button>
                <p className="text-xs text-gray-500 mt-2">Ghost small</p>
              </div>
            </div>
          </div>

          {/* Icon Buttons */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Icon Buttons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Primary with Icon */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-2.5 px-5 rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Item
                </button>
                <p className="text-xs text-gray-500 mt-2">Primary + Icon</p>
              </div>

              {/* Outline with Icon */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="w-full bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white font-medium py-2.5 px-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit
                </button>
                <p className="text-xs text-gray-500 mt-2">Outline + Icon</p>
              </div>

              {/* Icon Only Round */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="mx-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white w-12 h-12 rounded-full border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Icon Round
                </p>
              </div>

              {/* Icon Only Square */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="mx-auto bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white w-12 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Icon Square
                </p>
              </div>
            </div>
          </div>

          {/* Button States */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Button States
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Normal State */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-2.5 px-5 rounded-lg border-0 shadow-lg transition-all duration-200">
                  Normal
                </button>
                <p className="text-xs text-gray-500 mt-2">Default state</p>
              </div>

              {/* Hover State (simulated) */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="w-full bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-medium py-2.5 px-5 rounded-lg border-0 shadow-xl transform scale-105 transition-all duration-200">
                  Hover
                </button>
                <p className="text-xs text-gray-500 mt-2">Hover state</p>
              </div>

              {/* Loading State */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-2.5 px-5 rounded-lg border-0 shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  disabled
                >
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading
                </button>
                <p className="text-xs text-gray-500 mt-2">Loading state</p>
              </div>

              {/* Disabled State */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button
                  className="w-full bg-gray-300 text-gray-500 font-medium py-2.5 px-5 rounded-lg border-0 cursor-not-allowed"
                  disabled
                >
                  Disabled
                </button>
                <p className="text-xs text-gray-500 mt-2">Disabled state</p>
              </div>
            </div>
          </div>

          {/* Responsive Example */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Responsive Button Layout
            </h3>
            <div className="p-6 bg-white rounded-lg border shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-2.5 px-5 rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Primary Action
                </button>
                <button className="flex-1 bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white font-medium py-2.5 px-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Secondary Action
                </button>
                <button className="sm:flex-none bg-transparent text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium py-2.5 px-5 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Stacked on mobile, horizontal on larger screens
              </p>
            </div>
          </div>
        </section>

        {/* Form Components */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Form Components
          </h2>

          {/* Input Fields */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Input Fields
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Default Input */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">
                  Default Input
                </label>
                <input
                  type="text"
                  placeholder="Enter your text..."
                  className="w-full h-11 px-4 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500">
                  Standard text input with blue borders
                </p>
              </div>

              {/* Required Input */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  Required Input
                  <span className="text-red-500 text-base">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="w-full h-11 px-4 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500">
                  Required field with red asterisk
                </p>
              </div>

              {/* Error State Input */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">
                  Error State
                </label>
                <input
                  type="text"
                  placeholder="Invalid input..."
                  className="w-full h-11 px-4 border-2 border-red-300 hover:border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500"
                />
                <p className="text-xs text-red-600">
                  This field contains an error
                </p>
              </div>

              {/* Disabled Input */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-500">
                  Disabled Input
                </label>
                <input
                  type="text"
                  placeholder="Disabled input..."
                  disabled
                  className="w-full h-11 px-4 border-2 border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed rounded-lg placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500">
                  Disabled state with gray styling
                </p>
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Textarea</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">
                  Standard Textarea
                </label>
                <textarea
                  placeholder="Enter your message..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 resize-none"
                />
                <p className="text-xs text-gray-500">Multi-line text input</p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">
                  Textarea with Counter
                </label>
                <div className="relative">
                  <textarea
                    placeholder="Enter description..."
                    rows={4}
                    maxLength={200}
                    className="w-full px-4 py-3 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 resize-none"
                  />
                  <div className="absolute bottom-3 right-3 text-xs bg-white px-2 py-1 rounded text-gray-400">
                    0/200
                  </div>
                </div>
                <p className="text-xs text-gray-500">With character counter</p>
              </div>
            </div>
          </div>

          {/* Number Inputs */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Number Inputs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">
                  Price Input
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full h-11 pl-8 pr-4 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Currency input with prefix
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">
                  Quantity
                </label>
                <input
                  type="number"
                  placeholder="1"
                  min="1"
                  className="w-full h-11 px-4 text-center border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500">Centered number input</p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">
                  Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    max="100"
                    className="w-full h-11 pl-4 pr-8 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Percentage input with suffix
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Select Components */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Select Components
          </h2>

          {/* Basic Selects */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Basic Selects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">
                  Standard Select
                </label>
                <div className="relative">
                  <select className="w-full h-11 px-4 pr-10 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg bg-white text-gray-900 appearance-none cursor-pointer">
                    <option value="">Choose an option...</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Standard dropdown select
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  Required Select
                  <span className="text-red-500 text-base">*</span>
                </label>
                <div className="relative">
                  <select className="w-full h-11 px-4 pr-10 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg bg-white text-gray-900 appearance-none cursor-pointer">
                    <option value="">Select payment method...</option>
                    <option value="credit">Credit Card</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Required selection field
                </p>
              </div>
            </div>
          </div>

          {/* Custom Dropdown */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Custom Dropdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">
                  Client Selection
                </label>
                <div className="relative">
                  <button className="w-full h-11 px-4 text-left border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg bg-white text-gray-900 flex items-center justify-between">
                    <span className="text-gray-500">Choose a client...</span>
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Custom styled dropdown button
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">
                  Multi-Select
                </label>
                <div className="relative">
                  <button className="w-full h-11 px-4 text-left border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg bg-white text-gray-900 flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        Tag 1
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        Tag 2
                      </span>
                    </div>
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Multi-selection with tags
                </p>
              </div>
            </div>
          </div>

          {/* Searchable Select */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Searchable Select
            </h3>
            <div className="space-y-3 max-w-md">
              <label className="text-sm font-semibold text-gray-900">
                Search Countries
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search countries..."
                  className="w-full h-11 pl-10 pr-4 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Type to search and filter options
              </p>
            </div>
          </div>
        </section>

        {/* Modal and Popup Components */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Modal & Popup Components
          </h2>

          {/* Modal Examples */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Modal Examples
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Small Modal Trigger */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-2.5 px-5 rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Small Modal
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Compact confirmation dialog
                </p>
              </div>

              {/* Medium Modal Trigger */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-2.5 px-5 rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Form Modal
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Standard form dialog
                </p>
              </div>

              {/* Large Modal Trigger */}
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-2.5 px-5 rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Large Modal
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Full content dialog
                </p>
              </div>
            </div>
          </div>

          {/* Modal Preview */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Modal Preview
            </h3>
            <div className="bg-gray-100 rounded-lg p-8 relative overflow-hidden">
              {/* Modal Backdrop Simulation */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Confirm Action
                    </h3>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">
                      Are you sure you want to delete this item? This action
                      cannot be undone.
                    </p>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <button className="px-4 py-2 text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 rounded-lg transition-all duration-200">
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg transition-all duration-200">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Example modal with header, body, and action buttons
            </p>
          </div>

          {/* Dropdown/Popover Examples */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Dropdown & Popover
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dropdown Menu */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">
                  Dropdown Menu
                </label>
                <div className="relative">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-200 hover:border-blue-400 rounded-lg transition-all duration-200">
                    <span>Actions</span>
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Content (simulated as visible) */}
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border-2 border-blue-200 rounded-lg shadow-xl z-10">
                    <div className="py-2">
                      <button className="w-full px-4 py-2 text-left text-gray-900 hover:bg-blue-50 transition-colors duration-200">
                        Edit Item
                      </button>
                      <button className="w-full px-4 py-2 text-left text-gray-900 hover:bg-blue-50 transition-colors duration-200">
                        Duplicate
                      </button>
                      <hr className="my-2 border-gray-200" />
                      <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Action menu dropdown</p>
              </div>

              {/* Date Picker Popover */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">
                  Date Picker
                </label>
                <div className="relative">
                  <button className="w-full h-11 px-4 text-left border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg bg-white text-gray-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Pick a date...</span>
                    </div>
                  </button>
                </div>
                <p className="text-xs text-gray-500">Calendar date selection</p>
              </div>
            </div>
          </div>

          {/* Toast Notifications */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Toast Notifications
            </h3>
            <div className="space-y-4">
              {/* Success Toast */}
              <div className="flex items-center gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">Success!</p>
                  <p className="text-sm text-green-700">
                    Your invoice has been created successfully.
                  </p>
                </div>
                <button className="flex-shrink-0 text-green-500 hover:text-green-700">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Error Toast */}
              <div className="flex items-center gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Error!</p>
                  <p className="text-sm text-red-700">
                    Please check your input and try again.
                  </p>
                </div>
                <button className="flex-shrink-0 text-red-500 hover:text-red-700">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Info Toast */}
              <div className="flex items-center gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Info</p>
                  <p className="text-sm text-blue-700">
                    Auto-save is enabled for this form.
                  </p>
                </div>
                <button className="flex-shrink-0 text-blue-500 hover:text-blue-700">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DesignSystem;
