import React from 'react';
import { BottomNavContainer } from './Navbar.styles';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useCart } from '../../contexts/CartContext';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export const BottomNav = () => {
  const { user, logout } = useUser();
  const { cartCount } = useCart();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <BottomNavContainer>
      {user ? (
        <IconButton color="inherit" onClick={handleOpenMenu}>
          <PersonIcon />
        </IconButton>
      ) : (
        <IconButton component={Link} to="/login" color="inherit">
          <LoginIcon />
        </IconButton>
      )}

      <IconButton component={Link} to="/cart" color="inherit" size="large">
        <Badge badgeContent={cartCount} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <LocationOnIcon fontSize="small" />
          <span style={{ fontSize: '0.8rem' }}>{user.postalCode}</span>
        </div>
      ) : (
        <div style={{ width: '24px' }}></div>
      )}

      {/* PERSON MENU */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem disabled>Hello {user?.name}</MenuItem>

        <MenuItem
          onClick={() => {
            handleCloseMenu();
            logout();
          }}
        >
          <ExitToAppIcon fontSize="small" style={{ marginRight: 8 }} />
          Logout
        </MenuItem>
      </Menu>
    </BottomNavContainer>
  );
};
