import { useState, useEffect, useRef } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import {
  AllProductsCategory,
  capitalizeCategory,
} from "../../utils/categories";
import companyLogo from "../../assets/company_logo.png";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import {
  StyledAppBar,
  StyledToolbar,
  LogoImg,
  Brand,
  SearchContainer,
  SearchWrapper,
  SearchForm,
  CategoryButton,
  SearchInput,
  SuggestionsWrapper,
  Highlight,
  SearchIconWrapper,
} from "./Navbar.styles";
import { useProductsContext } from "@/contexts/ProductsContext";
import { useCategoriesContext } from "@/contexts/CategoriesContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isMobile = useMediaQuery("(max-width:519px)");
  const isTablet = useMediaQuery("(min-width:520px) and (max-width:900px)");
  const searchRef = useRef<HTMLDivElement>(null);

  // CART + USER
  const { cartCount } = useCart();
  const { user, logout } = useUser();

  // PRODUCTS (for suggestions)
  const { products: allProducts } = useProductsContext();

  // CATEGORIES
  const { categories } = useCategoriesContext();

  // CATEGORY DROPDOWN STATE
  const [catAnchor, setCatAnchor] = useState<null | HTMLElement>(null);
  const catOpen = Boolean(catAnchor);

  const handleOpenCategories = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCatAnchor(event.currentTarget);
  };

  const handleCloseCategories = () => {
    setCatAnchor(null);
  };

  // LOCAL SEARCH STATE (UI)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(AllProductsCategory);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // INIT FROM URL WHEN IN SEARCH CONTEXT
  useEffect(() => {
  const isSearchContext =
    location.pathname === "/" ||
    location.pathname.startsWith("/search") ||
    location.pathname.startsWith("/category");

  if (!isSearchContext) {
    setSearchTerm("");
    setSelectedCategory(AllProductsCategory);
    setSuggestions([]);
    return;
  }

  const q = searchParams.get("q") || "";
  const cat = searchParams.get("cat");

  setSearchTerm(q);
  setSelectedCategory(cat ? capitalizeCategory(cat) : AllProductsCategory);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [location.pathname, location.search]);



  // CLICK OUTSIDE TO CLOSE SUGGESTIONS
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function highlightMatch(text: string, query: string) {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);

    return (
      <>
        {before}
        <Highlight>{match}</Highlight>
        {after}
      </>
    );
  }

  // LIVE SUGGESTIONS (LOCAL ONLY, DOES NOT UPDATE RESULTS)
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (!value.trim() || !allProducts) {
      setSuggestions([]);
      return;
    }

    let matches = allProducts;

    if (selectedCategory !== AllProductsCategory) {
      matches = matches.filter(
        (p) =>
          p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    const list = matches
      .filter((p) => p.title.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 10)
      .map((p) => p.title);

    setSuggestions(list);
  };

  // CATEGORY SELECT (APPLIES CURRENT SEARCH TERM)
  const handleCategorySelect = (cat: string) => {
    const capitalized = capitalizeCategory(cat);
    setSelectedCategory(capitalized);

    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set("q", searchTerm.trim());
    }

    if (cat !== AllProductsCategory) {
      params.set("cat", cat.toLowerCase());
    }

    navigate(`/search?${params.toString()}`);
    handleCloseCategories();
  };

  // SUBMIT SEARCH (ENTER OR ICON)
  const handleSearchSubmit = () => {
    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set("q", searchTerm.trim());
    }

    if (selectedCategory !== AllProductsCategory) {
      params.set("cat", selectedCategory.toLowerCase());
    }

    // Always go to search/home context from anywhere (cart, product, etc.)
    navigate(`/search?${params.toString()}`);
    setSuggestions([]);
  };

  // CLICK SUGGESTION
  const handleSuggestionClick = (title: string) => {
    setSearchTerm(title);

    const params = new URLSearchParams();
    params.set("q", title);

    if (selectedCategory !== AllProductsCategory) {
      params.set("cat", selectedCategory.toLowerCase());
    }

    navigate(`/search?${params.toString()}`);
    setSuggestions([]);
  };

  // ...rendering stays the same, just wire:
  // - SearchInput.value = searchTerm
  // - onChange = handleSearchChange
  // - SearchForm.onSubmit = handleSearchSubmit
  // - CategoryButton.onClick = handleOpenCategories
  // - MenuItem.onClick = () => handleCategorySelect(cat)
  // - suggestion MenuItem.onClick = () => handleSuggestionClick(suggestion)

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        {isMobile ? (
          <>
            {/* MOBILE: logo + search only */}

            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <LogoImg src={companyLogo} alt="Company logo" />
            </Link>

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
                      <MenuItem
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                      >
                        {capitalizeCategory(cat)}
                      </MenuItem>
                    ))}
                  </Menu>

                  <SearchInput
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e: { target: { value: string; }; }) => handleSearchChange(e.target.value)}
                  />
                  <SearchIconWrapper type="submit">
                    <SearchIcon />
                  </SearchIconWrapper>
                </SearchForm>

                {/* LIVE SUGGESTIONS DROPDOWN */}
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
          </>
        ) : (
          <>
            <Brand to="/">Shop</Brand>
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
                      <MenuItem
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                      >
                        {capitalizeCategory(cat)}
                      </MenuItem>
                    ))}
                  </Menu>
                  <SearchInput
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e: { target: { value: string; }; }) => handleSearchChange(e.target.value)}
                  />
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

            <IconButton
              component={Link}
              to="/cart"
              size={isTablet ? 'small' : 'large'}
              color="inherit"
            >
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {user ? (
              isTablet ? (
                <IconButton color="inherit" onClick={logout} size="small">
                  <PersonIcon />
                </IconButton>
              ) : (
                <Button color="inherit" onClick={logout}>
                  Hello {user.name} — Logout
                </Button>
              )
            ) : isTablet ? (
              <IconButton
                component={Link}
                color="inherit"
                to="/login"
                size="small"
              >
                <LoginIcon />
              </IconButton>
            ) : (
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
            )}
          </>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
}
