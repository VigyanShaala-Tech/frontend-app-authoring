# StudioHeaderUserMenuSlot

### Slot ID: `org.openedx.frontend.authoring.studio_header_user_menu.v1`

### Slot ID Aliases
* `studio_header_user_menu_slot`

### Plugin Props:

* `username` - String. Username of the authenticated user.
* `studioBaseUrl` - String. Link to Studio home (`/home` when the new home page is enabled).
* `logoutUrl` - String. Logout URL.
* `isAdmin` - Boolean. Whether the authenticated user is a global staff/administrator.

## Description

The slot holds the items of the user dropdown menu at the top right of the Studio header,
on both the desktop and mobile layouts.

By default, the slot contains the **Studio Home** and **Logout** items.

Widgets are rendered inside the Paragon dropdown menu, so they should render
`Dropdown.Item` elements (or elements with the `dropdown-item` class).

## Example

The following example configuration adds an **LMS** item after the default items.

```js
import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';
import { getConfig } from '@edx/frontend-platform';
import { Dropdown } from '@openedx/paragon';

const LmsMenuItem = () => (
  <Dropdown.Item href={getConfig().LMS_BASE_URL} className="small">LMS</Dropdown.Item>
);

const config = {
  pluginSlots: {
    'org.openedx.frontend.authoring.studio_header_user_menu.v1': {
      keepDefault: true,
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'lms-menu-item',
            priority: 60,
            type: DIRECT_PLUGIN,
            RenderWidget: LmsMenuItem,
          },
        },
      ],
    },
  },
};

export default config;
```

To fully control the order of the items, hide `default_contents` and insert a widget that renders the complete list.
