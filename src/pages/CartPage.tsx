import { useCart } from '@/contexts/CartContext';
import { DangerButton, LinkButton } from '../components/common/Buttons';
import styled from 'styled-components';
import DeleteIcon from '@mui/icons-material/Delete';
import { QuantityControls } from '../components/common/QuantityControls';
import { productTheme, secondary } from '../utils/colors';
import { formatPrice } from '../utils/formatPrice';
import { Link } from 'react-router-dom';

const StyledDeleteIcon = styled(DeleteIcon)`
  margin-left: 5px;
`;

const StyledDangerButton = styled(DangerButton)`
  && {
    margin-bottom: 2rem;
    margin-top: 2rem;
    position: static;
  }
`;

const TotalCart = styled.h2`
  margin-bottom: 2rem;
  margin-top: 2rem;
`;

const ProductWrapper = styled(Link)`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border: 1px solid ${secondary.border};
  padding: 1rem;
  width: 100%;
  flex-wrap: wrap;
  text-decoration: none;
  transition: box-shadow 0.2s ease;
  border: 1px solid ${productTheme.cardBorder};
  border-radius: 8px;
  text-decoration: none;
  color: ${secondary.color};

  &:hover {
    box-shadow: 0 2px 8px ${productTheme.cardShadow};
  }
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductDetailsContainer = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const QuantityControlsWrapper = styled.div`
  margin-left: auto;

  @media (max-width: 500px) {
    margin-left: 0;
    align-self: flex-start;
  }
`;

const CartFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 4rem;
  @media (min-width: 600px) {
    width: 90%;
  }

  @media (min-width: 900px) {
    width: 80%;
  }

  @media (min-width: 1200px) {
    width: 70%;
  }

  @media (min-width: 1300px) {
    width: 60%;
  }
`;

const EmptyCartInformation = styled.div`
  display: flex;
  flex-direction: column;
  height: 7rem;
  width: fit-content;
  justify-content: space-between;
  margin-top: 5rem;
  align-items: center;
`;

const CartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-top: 4rem;
  margin-bottom: 2rem;

  @media (min-width: 600px) {
    width: 90%;
  }

  @media (min-width: 900px) {
    width: 80%;
  }

  @media (min-width: 1200px) {
    width: 70%;
  }

  @media (min-width: 1300px) {
    width: 60%;
  }
`;

const StyledTitle = styled.h1`
  margin-bottom: 2rem;
`;

const StyledLinkButton = styled(LinkButton)`
  && {
    width: 128px;
    height: 42px;
    padding: 8px 16px;
    line-height: 1.75;
    margin: 2rem 0;
  }
`;

const CartContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;

  @media (min-width: 600px) {
    width: 90%;
  }

  @media (min-width: 900px) {
    width: 80%;
  }

  @media (min-width: 1200px) {
    width: 70%;
  }

  @media (min-width: 1300px) {
    width: 60%;
  }
`;

export default function CartPage() {
  const { items, clear } = useCart();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div>
      <CartWrapper>
        {items.length > 0 && (
          <CartHeader>
            <h1>Your Cart</h1>
            <StyledDangerButton onClick={clear}>
              Clear cart
              <StyledDeleteIcon />
            </StyledDangerButton>
          </CartHeader>
        )}
        {items.length === 0 && (
          <EmptyCartInformation>
            <StyledTitle>Your Cart</StyledTitle>
            <p>Your cart is empty.</p>
            <StyledLinkButton to="/">Back to Shop</StyledLinkButton>
          </EmptyCartInformation>
        )}

        {items.length > 0 && (
          <>
            <CartContainer>
              {items.map((item) => (
                <ProductWrapper key={item.id} to={`/product/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '80px', height: 'auto', flexShrink: 0 }}
                  />
                  <ProductDetailsContainer>
                    <ProductDetails style={{ flex: 1 }}>
                      <h3>{item.title}</h3>
                      <p>${formatPrice(item.price)}</p>
                    </ProductDetails>
                    <QuantityControlsWrapper>
                      <QuantityControls id={item.id} quantity={item.quantity} />
                    </QuantityControlsWrapper>
                  </ProductDetailsContainer>
                </ProductWrapper>
              ))}
            </CartContainer>
            <CartFooter>
              <StyledLinkButton to="/">Back to Shop</StyledLinkButton>
              <TotalCart>Total: ${total.toFixed(2)}</TotalCart>
            </CartFooter>
          </>
        )}
      </CartWrapper>
    </div>
  );
}
