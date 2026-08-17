'use no memo';

import * as React from 'react';
import { requestWidgetUpdate } from 'react-native-android-widget';

import { BebekWidget } from './BebekWidget';
import { buildWidgetProps } from './widgetContent';

/** Pushes the current app state into any placed BebekWidget instances. No-ops on iOS/web and when no widget is placed. */
export function syncWidget(): void {
  requestWidgetUpdate({
    widgetName: 'BebekWidget',
    renderWidget: async () => <BebekWidget {...(await buildWidgetProps())} />,
  }).catch(() => {});
}
