import { Avatar, DropdownButton } from '@openedx/paragon';

import StudioHeaderUserMenuSlot from '../../plugin-slots/StudioHeaderUserMenuSlot';

interface UserMenuProps {
  username?: string;
  studioBaseUrl: string;
  logoutUrl: string;
  authenticatedUserAvatar?: string;
  isMobile?: boolean;
  isAdmin?: boolean;
}

const UserMenu = ({
  username,
  studioBaseUrl,
  logoutUrl,
  authenticatedUserAvatar,
  isMobile = false,
  isAdmin = false,
}: UserMenuProps) => {
  const avatar = authenticatedUserAvatar ? (
    <img
      className="d-block w-100 h-100"
      src={authenticatedUserAvatar}
      alt={username}
      data-testid="avatar-image"
    />
  ) : (
    <Avatar
      size="sm"
      className="mr-2"
      alt={username}
      data-testid="avatar-icon"
    />
  );
  const title = isMobile ? avatar : <>{avatar}{username}</>;

  // Same markup as the package's NavDropdownMenu, with the items rendered by a plugin slot.
  return (
    <DropdownButton
      id="user-dropdown-menu"
      title={title}
      variant="outline-primary"
      className="mr-2"
    >
      <StudioHeaderUserMenuSlot
        username={username}
        studioBaseUrl={studioBaseUrl}
        logoutUrl={logoutUrl}
        isAdmin={isAdmin}
      />
    </DropdownButton>
  );
};

export default UserMenu;
