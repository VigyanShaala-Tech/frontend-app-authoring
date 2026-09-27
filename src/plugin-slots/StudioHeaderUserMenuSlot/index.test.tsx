import { render, initializeMocks } from '@src/testUtils';
import StudioHeaderUserMenuSlot from '.';

jest.mock('@openedx/frontend-plugin-framework', () => ({
  PluginSlot: 'PluginSlot',
}));

describe('StudioHeaderUserMenuSlot', () => {
  beforeEach(() => initializeMocks());

  test('renders the slot with the default menu items', () => {
    const { container, getByText } = render(
      <StudioHeaderUserMenuSlot
        username="abc123"
        studioBaseUrl="/home"
        logoutUrl="http://localhost:18000/logout"
        isAdmin
      />,
    );
    const slot = container.querySelector('pluginslot');
    expect(slot).toBeInTheDocument();
    expect(slot?.getAttribute('id')).toBe('org.openedx.frontend.authoring.studio_header_user_menu.v1');
    expect(slot?.getAttribute('idaliases')).toBe('studio_header_user_menu_slot');
    expect(getByText('Studio Home')).toBeInTheDocument();
    expect(getByText('Logout')).toBeInTheDocument();
  });
});
