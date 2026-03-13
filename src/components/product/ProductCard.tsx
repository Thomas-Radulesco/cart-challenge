import type { Product } from '../../types/product';
import {
  Card,
  ImageWrapper,
  ProductImage,
  Title,
  ShortDescription,
  Price,
} from './Product.styles';
import { PrimaryButton } from '../common/Buttons';
import { useCart } from '../../contexts/CartContext';
import { QuantityControls } from '../common/QuantityControls';
import { AddShoppingCart } from '@mui/icons-material';
import styled from 'styled-components';
import { formatPrice } from '../../utils/formatPrice';

const StyledAddIcon = styled(AddShoppingCart)`
  margin-left: 25px;
`;

const StyledPrimaryButton = styled(PrimaryButton)`
  && {
    margin-top: 9px;
    position: static;
    height: 40px;
    border: 1px solid #ff9900;
  }
`;

export const ProductCard = ({ product }: { product: Product }) => {
  const { add, items } = useCart();
  const quantity = items.find((i) => i.id === product.id)?.quantity || 0;

  return (
    <Card to={`/product/${product.id}`}>
      <ImageWrapper>
        <ProductImage src={product.image} alt={product.title} />
      </ImageWrapper>

      <Title>{product.title}</Title>

      <ShortDescription>{product.description.slice(0, 60)}…</ShortDescription>

      <Price>${formatPrice(product.price)}</Price>

      {quantity === 0 ? (
        <StyledPrimaryButton
          onClick={(evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            add({ ...product, quantity: 1 });
          }}
        >
          Add to Cart <StyledAddIcon />
        </StyledPrimaryButton>
      ) : (
        <QuantityControls id={product.id} quantity={quantity} />
      )}
    </Card>
  );
};
