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
import { DeleteSearchTermButton } from "./Navbar.styles";
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
  setSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  highlightedIndex: number;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>;
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
  setSuggestions,
  highlightedIndex,
  setHighlightedIndex,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const count = suggestions.length;

    if (count === 0) return;

    switch (e.key) {
      case "ArrowDown":
      case "Tab":
        if (e.shiftKey) {
          // SHIFT + TAB → previous
          e.preventDefault();
          setHighlightedIndex((prev) => (prev - 1 + count) % count);
        } else {
          // TAB → next
          e.preventDefault();
          setHighlightedIndex((prev) => (prev + 1) % count);
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + count) % count);
        break;

      case "Escape":
        setSuggestions([]);
        setHighlightedIndex(-1);
        break;

      case "Enter":
        if (highlightedIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
    }
  };

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
            onKeyDown={(e) => handleKeyDown(e)}
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
            {suggestions.map((suggestion, index) => (
              <MenuItem
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                selected={index === highlightedIndex}
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
