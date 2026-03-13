import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { SecondaryButton } from '../components/common/Buttons';
import styled from 'styled-components';
import { LinkButton } from '../components/common/Buttons';

const StyledSecondaryButton = styled(SecondaryButton)`
  && {
    margin: 2rem;
  }
`;

const PositionedLinkButton = styled(LinkButton)`
  && {
    position: relative;
    top: 10px;
  }
`;

export default function LoginPage() {
  const { login } = useUser();
  const navigate = useNavigate();

  function handleLogin() {
    login({
      id: '1',
      name: 'Thomas',
      email: 'thomas@example.com',
      postalCode: '75000',
    });

    navigate('/dashboard');
  }

  return (
    <div>
      <h1>Login</h1>
      <StyledSecondaryButton onClick={handleLogin}>
        Log in
      </StyledSecondaryButton>
      <PositionedLinkButton to="/">Back to Shop</PositionedLinkButton>
    </div>
  );
}
