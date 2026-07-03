import { Sun, Moon } from "lucide-react";

function ThemeToggle({ theme, onToggle }: { theme: "light" | "dark"; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="icon-btn">
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export default ThemeToggle;
