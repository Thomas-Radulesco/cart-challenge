import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
`;

const SkeletonBlock = styled.div<{ height: string }>`
  background: #e0e0e0;
  border-radius: 6px;
  height: ${(p) => p.height};
  width: 100%;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

const ImagePlaceholder = styled(SkeletonBlock)`
  height: 180px;
  margin-bottom: 12px;
`;

export const SkeletonCard = () => {
  return (
    <div data-testid="skeleton-card">
      <Card>
        <ImagePlaceholder height="180px" />

        <SkeletonBlock height="20px" style={{ marginBottom: '8px' }} />
        <SkeletonBlock height="16px" style={{ marginBottom: '8px' }} />
        <SkeletonBlock height="16px" style={{ marginBottom: '12px' }} />

        <SkeletonBlock height="28px" />
      </Card>
    </div>
  );
};
