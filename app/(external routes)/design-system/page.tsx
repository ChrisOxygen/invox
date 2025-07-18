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
          <div className=""></div>
        </section>
      </div>
    </div>
  );
}

export default DesignSystem;
