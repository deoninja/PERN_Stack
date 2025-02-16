import { PaletteIcon } from "lucide-react";
import { THEMES } from "../constant";
import { useThemeStore } from "../store/useThemeStore";

function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      {/* DROPDOWN TRIGGER */}
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <PaletteIcon className="size-5" />
      </button>

      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl
        w-56 sm:w-64 md:w-72 lg:w-80 border border-base-content/10
        max-h-[60vh] overflow-y-auto"
      >
        {THEMES.map((themeOption, index) => (
          <button
          key={themeOption.id || index}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors hover:cursor-pointer
                ${
                  theme === themeOption.name
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-base-content/5"
                }
              `}
            onClick={() => setTheme(themeOption.name)}
          >
            <PaletteIcon className="size-4" />
            <span className="text-sm font-medium">{themeOption.label}</span>

            {/* THEME PREVIEW COLORS */}
            <div className="ml-auto flex gap-1">
              {themeOption.colors.map((color, i) => (
                <span
                  key={i}
                  className="size-3 sm:size-4 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
export default ThemeSelector;
