import styled from 'styled-components';
import { SecondaryButton } from '../components/common/Buttons';
import { Link } from 'react-router-dom';
// import NotFoundImage from '../assets/404.webp';
// import PageNotFoundSVG from '../assets/404.svg';
import { useEffect } from "react";
import Lottie from "lottie-react";
import animation404 from "../assets/404.json";
// import "../assets/lottiePlayer.js";
// import { primary, productTheme } from '@/utils/colors';
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

// const Code = styled.h1`
//   font-size: 5rem;
//   margin: 0;
//   color: ${primary.background};
// `;

const Message = styled.p`
  font-size: 1.25rem;
  margin: 1rem 0 2rem;
  color: ${productTheme.shortDescriptionColor};
`;

const LottieWrapper = styled.div`
  position: relative;
  z-index: 0; 
  // width: 300px;
  // height: 300px;
  overflow: hidden;
`;

export const NotFoundPage = () => {

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <Wrapper>
      {/* <img
        src={PageNotFoundSVG}
        alt="Page not found"
        style={{ maxWidth: '800px', marginBottom: '1.5rem' }}
      /> */}
      <LottieWrapper>
        <Lottie
          animationData={animation404}
          loop
          autoplay
          // style={{ width: 300, height: 300 }}
        />
        {/* <lottie-player
          src="https://assets9.lottiefiles.com/packages/lf20_kcsr6fcp.json"
          background="transparent"
          speed="1"
          loop
          autoplay
          style={{ width: "300px", height: "300px", marginBottom: "1.5rem" }}
        ></lottie-player> */}
      </LottieWrapper>

      {/* <Code>404</Code> */}
      <Message>Oops… This page doesn't exist.</Message>

      <SecondaryButton as={Link} to="/">
        Back to Shop
      </SecondaryButton>
    </Wrapper>
  );
};
