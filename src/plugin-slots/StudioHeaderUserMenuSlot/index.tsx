import { PluginSlot } from '@openedx/frontend-plugin-framework';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Dropdown } from '@openedx/paragon';
import getUserMenuItems from '@edx/frontend-component-header/dist/studio-header/utils';
import { Link } from 'react-router-dom';

export interface StudioHeaderUserMenuSlotProps {
  username?: string;
  studioBaseUrl: string;
  logoutUrl: string;
  isAdmin?: boolean;
}

const StudioHeaderUserMenuSlot = ({
  username,
  studioBaseUrl,
  logoutUrl,
  isAdmin = false,
}: StudioHeaderUserMenuSlotProps) => {
  const intl = useIntl();
  const items = getUserMenuItems({
    studioBaseUrl,
    logoutUrl,
    intl,
    isAdmin,
  });

  return (
    <PluginSlot
      id="org.openedx.frontend.authoring.studio_header_user_menu.v1"
      idAliases={['studio_header_user_menu_slot']}
      pluginProps={{
        username,
        studioBaseUrl,
        logoutUrl,
        isAdmin,
      }}
    >
      {items.map(item => (
        <Dropdown.Item
          as={Link}
          key={`${item.title}-dropdown-item`}
          to={item.href}
          className="small"
        >
          {item.title}
        </Dropdown.Item>
      ))}
    </PluginSlot>
  );
};

export default StudioHeaderUserMenuSlot;
