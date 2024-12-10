import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Train, LogOut } from "lucide-react";
import LanguageSwitch from "./LanguageSwitch";
import NotificationPanel from "./notifications/NotificationPanel";
import { useAuth } from "../contexts/AuthContext";
import Button from "./common/Button";

const Navbar: React.FC = () => {
  const { t } = useTranslation("common");
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Train className="w-8 h-8 text-indigo-600" />
            <span className="font-bold text-xl">Train</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/search" className="hover:text-indigo-600 transition-colors">
              {t("search")}
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
                  {t("dashboard")}
                </Link>
                <NotificationPanel />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  {t("logout")}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-600 transition-colors">
                  {t("login")}
                </Link>
                <Link to="/register" className="hover:text-indigo-600 transition-colors">
                  {t("register")}
                </Link>
              </>
            )}
            <LanguageSwitch />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
