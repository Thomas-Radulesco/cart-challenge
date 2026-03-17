import styled from 'styled-components';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { navbarTheme } from '@/utils/colors';

export const StyledAppBar = styled(AppBar)`
  && {
    position: fixed;
    top: 0;
    left: 0;
    background-color: ${navbarTheme.background};
    color: ${navbarTheme.text};
    z-index: 20;
  }
`;

export const StyledToolbar = styled(Toolbar)`
  && {
    display: flex;
    flex-wrap: wrap;
    min-height: 46px;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;

    @media (min-width: 600px) {
      height: 56px;
      padding: 0 12px;
    }
    @media (min-width: 700px) {
      gap: 1rem;
    }
  }
`;

export const LogoImg = styled.img`
  width: 30px;
  height: 30px;
  object-fit: contain;
  display: block;
`;

export const Brand = styled(Link)`
  display: block;
  text-align: left;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: bold;
  color: inherit;
  margin-left: 0.2rem;

  @media (min-width: 520px) {
    font-size: 0.875rem;
  }

  @media (min-width: 700px) {
    width: 120px !important;
    font-size: 1.2rem;
    font-weight: bold;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  width: calc(100% - 30px - 1rem);
  margin: 0 auto;
  flex-shrink: 0;

  @media (min-width: 400px) {
    width: calc(100% - 30px - 1rem);
    font-size: 1.2rem;
  }

  @media (min-width: 520px) {
    width: calc(100% - 165px - 1rem);
    font-size: 1.2rem;
    margin: 0;
  }

  @media (min-width: 700px) {
    width: calc(100% - 225px - 1rem);
  }

  @media (min-width: 900px) {
    width: calc(100% - 405px - 1rem);
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 6px;
  overflow: hidden;
`;

export const CategoryButton = styled(Button)`
  && {
    background-color: ${navbarTheme.categoryButtonBackground};
    color: ${navbarTheme.categoryButtonText};
    text-transform: none;
    border-radius: 6px 0 0 6px;
    border-right: none;
    padding: 6px 8px;
    font-size: 0.8rem;
    height: 40px;
    min-height: 40px;
    line-height: normal;

    &:hover {
      background-color: ${navbarTheme.categoryButtonHoverBckg};
    }
  }
`;

export const SearchInput = styled(InputBase)`
  && {
    padding-left: 12px;
    flex: 1 1 auto;
    min-width: 0;
  }
`;

export const SuggestionsWrapper = styled(Paper)`
  && {
    position: absolute;
    top: 110%;
    width: 100%;
    max-width: 800px;
    z-index: 10;
    max-height: 300px;
    overflow-y: auto;
  }
`;
export const Highlight = styled.span`
  font-weight: bold;
  color: ${navbarTheme.highlightSpanColor};
`;

export const SearchIconWrapper = styled.button`
  background-color: ${navbarTheme.searchIconWrapperBckgColor};
  border: none;
  padding: 6px 8px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 6px 6px 0;
  cursor: pointer;

  &:hover {
    background-color: ${navbarTheme.searchIconWrapperHoverBckgColor};
  }

  &:active {
    background-color: ${navbarTheme.searchIconWrapperActiveBckgColor};
  }

  svg {
    color: ${navbarTheme.searchIconWrapperSVGColor};
  }
`;

export const BottomNavContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 56px;

  background-color: ${navbarTheme.bottomNavContainerBckgColor};
  color: ${navbarTheme.bottomNavContainerColor};
  border-top: 1px solid ${navbarTheme.bottomNavContainerBorderColor};

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;

  z-index: 20;

  @media (min-width: 520px) {
    display: none;
  }
`;

export const DeleteSearchTermButton = styled.button<{ $isMobile: boolean }>`
  color: ${navbarTheme.deleteSearchTermButtonCol};
  background-color: ${navbarTheme.categoryButtonBackground};
  border-radius: 50%;
  border: none;
  position: absolute;
  right: ${({ $isMobile }) => $isMobile ? "40px" : "48px"};
  cursor: pointer;
  font-size: 18px;
  height: 1rem;
  width: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    background-color: ${navbarTheme.categoryButtonHoverBckg};
  }
`;