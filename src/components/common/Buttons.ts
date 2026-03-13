import styled from 'styled-components';
import Button, { type ButtonProps } from '@mui/material/Button';
import { primary, secondary, danger } from '../../utils/colors';
import { Link, type LinkProps } from 'react-router-dom';

export const LinkButton = styled(Link)<LinkProps>`
  && {
    width: 90px;
    height: 42px;
    padding: 4px 8px;
    margin: 2rem;
    text-align: center;
    line-height: normal;
    display: inline-block;
    background-color: ${secondary.background};
    color: ${secondary.color};
    text-transform: none;
    font-weight: 500;
    border-radius: 6px;
    border: 1px solid ${secondary.border};
    text-decoration: none;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-size: 0.875rem;
    letter-spacing: 0.02857em;
    &:hover {
      background-color: ${secondary.hover};
    }
    &:active {
      background-color: ${secondary.active};
    }
    &:visited {
      text-decoration: none;
      color: ${secondary.color};
    }
      &:hover,
      &:active,
      &:visited,
      color: ${secondary.color};
  }
`;

export const PrimaryButton = styled(Button)<ButtonProps>`
  && {
    background-color: ${primary.background};
    color: ${primary.color};
    text-transform: none;
    font-weight: 600;
    border-radius: 6px;
    padding: 8px 16px;

    &:hover {
      background-color: ${primary.hover};
    }

    &:active {
      background-color: ${primary.active};
    }
  }
`;

export const SecondaryButton = styled(Button)<ButtonProps>`
  && {
    position: static;
    background-color: ${secondary.background};
    color: ${secondary.color};
    text-transform: none;
    font-weight: 500;
    border-radius: 6px;
    padding: 8px 16px;
    border: 1px solid ${secondary.border};
    text-decoration: none;
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    font-size: 0.875rem;
    line-height: 1.75;
    letter-spacing: 0.02857em;
    display: inline-block;

    &:hover,
    &:focus,
    &:visited {
      text-decoration: none;
      color: ${secondary.color};
    }

    &:hover {
      background-color: ${secondary.hover};
    }

    &:active {
      background-color: ${secondary.active};
    }
  }
`;

export const DangerButton = styled(Button)<ButtonProps>`
  && {
    position: static;
    background-color: ${danger.background};
    color: ${danger.color};
    text-transform: none;
    font-weight: 500;
    border-radius: 6px;
    padding: 8px 16px;
    border: 1px solid ${danger.border};

    &:hover {
      background-color: ${danger.hover};
    }

    &:active {
      background-color: ${danger.active};
    }
  }
`;
