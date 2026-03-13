import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { productTheme } from '@/utils/colors';

export const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;

  border: 1px solid ${productTheme.cardBorder};
  border-radius: 8px;
  padding: 12px;

  background: ${productTheme.cardBackground};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px ${productTheme.cardShadow};
  }
`;

export const ImageWrapper = styled.div`
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const ProductImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

export const Title = styled.h3`
  font-size: 1rem;
  margin: 0.5rem 0 0.25rem;
  height: 2.5rem;
  overflow: hidden;
`;

export const ShortDescription = styled.p`
  font-size: 0.85rem;
  color: ${productTheme.shortDescriptionColor};
  height: 2.5rem;
  overflow: hidden;
`;

export const Price = styled.div`
  margin-top: auto;
  font-weight: bold;
  font-size: 1.1rem;
  margin-left: auto;
`;
