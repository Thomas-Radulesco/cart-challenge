import styled from 'styled-components';

export const PageContainer = styled.div`
  padding-top: 70px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 100px;

  @media (min-width: 600px) {
    padding-top: 80px;
    padding-left: 24px;
    padding-right: 24px;
  }

  @media (min-width: 900px) {
    padding-left: 150px;
    padding-right: 150px;
  }

  @media (min-width: 1200px) {
    padding-left: 200px;
    padding-right: 200px;
    padding-bottom: 200px;
  }

  @media (min-width: 1850px) {
    padding-left: 350px;
    padding-right: 350px;
    padding-bottom: 300px;
  }
`;
