import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Product } from '../types/product';
import { fetchProductById } from '@/api/products';
import { PrimaryButton } from '../components/common/Buttons';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';
import { AddShoppingCart } from '@mui/icons-material';
import { formatPrice } from '../utils/formatPrice';
import { QuantityControls } from '../components/common/QuantityControls';
import { SkeletonCard } from '../components/product/SkeletonCard';
import { LinkButton } from '../components/common/Buttons';

const StyledAddIcon = styled(AddShoppingCart)`
  margin-left: 25px;
`;

const ProductTitle = styled.h1`
  margin-top: 3rem;
`;

const ProductWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
  margin-top: 3rem;
  & img {
    margin: auto;
  }
  @media (min-width: 670px) {
    flex-direction: row;
  }
`;

const ProductDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProductInteraction = styled.div`
  align-self: flex-end;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 2rem;
  margin-bottom: 5rem;
`;

const StyledLinkButton = styled(LinkButton)`
  && {
    margin: 0px;
    width: 128px;
    display: flex;
    align-items: center;
    justify-content: center;
    
`;

const StyledQuantityControls = styled(QuantityControls)`
  && {
    margin: 0px;
  }
`;

const StyledPrimaryButton = styled(PrimaryButton)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 16px 8px 16px;
  }
`;

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { items, add } = useCart();
  const quantity = items.find((i) => i.id === product?.id)?.quantity || 0;

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetchProductById(Number(id))
      .then((data: Product | null) => setProduct(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 320px)',
          justifyContent: 'center',
          marginTop: '3rem',
        }}
      >
        <SkeletonCard />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <ProductWrapper>
      <ProductTitle>{product.title}</ProductTitle>
      <ProductCard>
        <img
          src={product.image}
          alt={product.title}
          style={{ maxWidth: '300px', objectFit: 'contain' }}
        />
        <ProductDataWrapper>
          <div>
            <p>
              <strong>Price:</strong> ${formatPrice(product.price)}
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            {product.rating && (
              <p>
                <strong>Rating:</strong> {product.rating.rate} (
                {product.rating.count} reviews)
              </p>
            )}
            <p style={{ marginTop: '1rem' }}>{product.description}</p>
          </div>
          <ProductInteraction>
            <StyledLinkButton to="/">Back to Shop</StyledLinkButton>
            {quantity === 0 ? (
              <StyledPrimaryButton
                onClick={() => add({ ...product, quantity: 1 })}
              >
                Add to Cart <StyledAddIcon />
              </StyledPrimaryButton>
            ) : (
              <StyledQuantityControls
                id={product.id}
                quantity={quantity}
                style={{ marginTop: '0px' }}
              />
            )}
          </ProductInteraction>
        </ProductDataWrapper>
      </ProductCard>
    </ProductWrapper>
  );
};
