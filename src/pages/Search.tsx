import React from "react";
import { useTranslation } from "react-i18next";
import SearchForm from "../components/search/SearchForm";

const Search: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          {t("search:searchButton")}
        </h1>

        <SearchForm />
      </div>
    </div>
  );
};

export default Search;
