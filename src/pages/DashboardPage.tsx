import { useUser } from '../contexts/UserContext';
import { SecondaryButton } from '../components/common/Buttons';
import styled from 'styled-components';
import { LinkButton } from '../components/common/Buttons';

const StyledSecondaryButton = styled(SecondaryButton)`
  && {
    margin: 2em;
  }
`;

const PositionedLinkButton = styled(LinkButton)`
  && {
    position: relative;
    top: 10px;
  }
`;

export default function DashboardPage() {
  const { user, logout } = useUser();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hello, {user?.name}</p>
      <StyledSecondaryButton onClick={logout}>Logout</StyledSecondaryButton>
      <PositionedLinkButton to="/">Back to Shop</PositionedLinkButton>
    </div>
  );
}
