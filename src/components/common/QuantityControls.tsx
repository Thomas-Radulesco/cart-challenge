import styled from 'styled-components';
import { useCart } from '../../contexts/CartContext';
import DeleteIcon from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { danger } from '../../utils/colors';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 9px;
  display: flex;
  justify-content: space-between;
  button {
    background: #eee;
    border: 1px solid #ccc;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 10px;
    &:hover {
      background: #ddd;
    }
  }

  span {
    font-weight: bold;
  }

  @media (min-width: 600px) {
    justify-content: space-between;
  }
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ControlButton = styled.button`
  width: 40px;
  height: 40px;
`;

const DeleteButton = styled(ControlButton)`
  && {
    background-color: ${danger.background};
    color: ${danger.color};
  }
`;

export const QuantityControls = ({
  id,
  quantity,
  style,
}: {
  id: number;
  quantity: number;
  style?: React.CSSProperties;
}) => {
  const { increment, decrement, remove } = useCart();

  return (
    <Wrapper style={style}>
      <ControlsWrapper>
        <ControlButton
          aria-label="decrement"
          onClick={(evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            decrement(id);
          }}
        >
          <Remove />
        </ControlButton>
        <span>{quantity}</span>
        <ControlButton
          aria-label="increment"
          onClick={(evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            increment(id);
          }}
        >
          <Add />
        </ControlButton>
      </ControlsWrapper>
      <DeleteButton
        aria-label="remove"
        onClick={(evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          remove(id);
        }}
      >
        <DeleteIcon />
      </DeleteButton>
    </Wrapper>
  );
};
