import styled from 'styled-components';
import { SecondaryButton } from '../components/common/Buttons';
import { Link } from 'react-router-dom';
// import { useEffect } from "react";
import Lottie from "lottie-react";
import animation404 from "../assets/404.json";
import { productTheme } from '@/utils/colors';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: calc(100vh - 120px); /* leaves room for navbar + bottom nav */
  padding: 2rem;
  text-align: center;
`;

const Message = styled.p`
  font-size: 1.25rem;
  margin: 1rem 0 2rem;
  color: ${productTheme.shortDescriptionColor};
`;

const LottieWrapper = styled.div`
  position: relative;
  z-index: 0;
  overflow: hidden;
`;

export const NotFoundPage = () => {
  return (
    <Wrapper>
      <LottieWrapper>
        <Lottie
          animationData={animation404}
          loop
          autoplay
        />
      </LottieWrapper>

      <Message>Oops… This page doesn't exist.</Message>

      <SecondaryButton as={Link} to="/">
        Back to Shop
      </SecondaryButton>
    </Wrapper>
  );
};
