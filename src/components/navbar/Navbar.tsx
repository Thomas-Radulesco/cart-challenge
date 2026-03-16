import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import {
  AllProductsCategory,
  capitalizeCategory,
} from '../../utils/categories';
import companyLogo from '../../assets/company_logo.png';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
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
} from './Navbar.styles';
import { useProductsContext } from '@/contexts/ProductsContext';
import { useCategoriesContext } from '@/contexts/CategoriesContext';

export default function Navbar() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:519px)');
  const isTablet = useMediaQuery('(min-width:520px) and (max-width:900px)');
  const searchRef = useRef<HTMLDivElement>(null);

  // CART + USER
  const { cartCount } = useCart();
  const { user, logout } = useUser();

  // PRODUCTS (for suggestions)
  const { products: allProducts } = useProductsContext();

  // CATEGORIES
  const { categories } = useCategoriesContext();
  const [selectedCategory, setSelectedCategory] = useState(AllProductsCategory);

  // CATEGORY DROPDOWN STATE
  const [catAnchor, setCatAnchor] = useState<null | HTMLElement>(null);
  const catOpen = Boolean(catAnchor);

  const handleOpenCategories = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCatAnchor(event.currentTarget);
  };

  const handleCloseCategories = () => {
    setCatAnchor(null);
  };

  const handleCategorySelect = (cat: string) => {
    const capitalizedCategory = capitalizeCategory(cat);

    setSelectedCategory(capitalizedCategory);

    const params = new URLSearchParams(location.search);

    if (cat === AllProductsCategory) {
      params.delete("cat");
    } else {
      params.set("cat", cat.toLowerCase());
    }
    navigate(`/search?${params.toString()}`);

    handleCloseCategories();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

  // SEARCH BAR STATE
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // LIVE SUGGESTIONS
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (!value.trim() || !allProducts) {
      setSuggestions([]);
      return;
    }

    let matches = allProducts;

    // Apply category filter first
    if (selectedCategory !== AllProductsCategory) {
      matches = matches.filter(
        (p) =>
          p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Then apply search term
    const suggestions = matches
      .filter((p) => p.title.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 10)
      .map((p) => p.title);

    setSuggestions(suggestions);
  };

  // SUBMIT SEARCH
  const handleSearchSubmit = () => {
    const catParam =
      selectedCategory === AllProductsCategory
        ? ''
        : selectedCategory.toLowerCase();

    navigate(`/search?q=${encodeURIComponent(searchTerm)}&cat=${catParam}`);
    setSuggestions([]);
  };

  // CLICK SUGGESTION
  const handleSuggestionClick = (title: string) => {
    setSearchTerm(title); // keep UI in sync
    
    const params = new URLSearchParams(location.search);
    params.set("q", title);

    navigate(`/search?${params.toString()}`);

    setSuggestions([]);
  };

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
                    onChange={(e) => handleSearchChange(e.target.value)}
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
                    onChange={(e) => handleSearchChange(e.target.value)}
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
