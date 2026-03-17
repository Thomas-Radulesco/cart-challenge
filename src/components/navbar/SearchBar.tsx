import {
  SearchContainer,
  SearchWrapper,
  SearchForm,
  CategoryButton,
  SearchInput,
  SuggestionsWrapper,
  SearchIconWrapper,
} from "./Navbar.styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import { DeleteSearchTermButton } from "./Navbar.styles"; // your styled clear button
import type { RefObject, ReactNode } from "react";

export interface SearchBarProps {
  searchTerm: string;
  selectedCategory: string;
  suggestions: string[];
  categories: string[] | null;
  isMobile: boolean;
  catAnchor: HTMLElement | null;
  catOpen: boolean;
  searchRef: RefObject<HTMLDivElement | null>;
  handleSearchChange: (value: string) => void;
  handleSearchSubmit: () => void;
  handleCategorySelect: (cat: string) => void;
  handleOpenCategories: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleCloseCategories: () => void;
  handleSuggestionClick: (title: string) => void;
  handleClearSearch: () => void;
  highlightMatch: (text: string, query: string) => ReactNode;
}

export function SearchBar({
  searchTerm,
  selectedCategory,
  suggestions,
  categories,
  isMobile,
  catAnchor,
  catOpen,
  searchRef,
  handleSearchChange,
  handleSearchSubmit,
  handleCategorySelect,
  handleOpenCategories,
  handleCloseCategories,
  handleSuggestionClick,
  handleClearSearch,
  highlightMatch,
}: SearchBarProps) {
  return (
    <SearchContainer ref={searchRef}>
      <SearchWrapper>
        <SearchForm
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchSubmit();
          }}
        >
          <CategoryButton onClick={handleOpenCategories}>
            {selectedCategory}
          </CategoryButton>

          <Menu
            anchorEl={catAnchor}
            open={catOpen}
            onClose={handleCloseCategories}
          >
            {categories?.map((cat) => (
              <MenuItem key={cat} onClick={() => handleCategorySelect(cat)}>
                {cat}
              </MenuItem>
            ))}
          </Menu>

          <SearchInput
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          {searchTerm && (
            <DeleteSearchTermButton
              type="button"
              onClick={handleClearSearch}
              $isMobile={isMobile}
            >
              ×
            </DeleteSearchTermButton>
          )}

          <SearchIconWrapper type="submit">
            <SearchIcon />
          </SearchIconWrapper>
        </SearchForm>

        {suggestions.length > 0 && (
          <SuggestionsWrapper>
            {suggestions.map((suggestion) => (
              <MenuItem
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {highlightMatch(suggestion, searchTerm)}
              </MenuItem>
            ))}
          </SuggestionsWrapper>
        )}
      </SearchWrapper>
    </SearchContainer>
  );
}
