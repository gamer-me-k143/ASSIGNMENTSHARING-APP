import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  handleLogout: () => Promise<void>;
}

export const Sidebar = ({
  currentPage,
  setCurrentPage,
  darkMode,
  setDarkMode,
  handleLogout,
}: SidebarProps) => (
  <motion.nav
    initial={{ x: -250 }}
    animate={{ x: 0 }}
    className="w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
  >
    <div className="flex flex-col h-full px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Time Pass Project</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Assignment Share</p>
        </div>
      </div>
      <ul className="space-y-2">
        {["Dashboard", "My Profile", "Upload Assignments", "Home Assignments"].map((item) => (
          <li key={item}>
            <button
              onClick={() => setCurrentPage(item.toLowerCase().replace(" ", "-"))}
              className={`w-full px-4 py-2 rounded-lg text-left transition duration-200 ${
                currentPage === item.toLowerCase().replace(" ", "-")
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-auto space-y-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  </motion.nav>
);
