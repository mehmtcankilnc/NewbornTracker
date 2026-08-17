'use no memo';

import * as React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

import type { RecordType } from '@/types/record';

import { BebekWidget } from './BebekWidget';
import { addRecordFromWidget, toggleSleepFromWidget } from './widgetStorage';
import { buildWidgetProps } from './widgetContent';

const nameToWidget = {
  BebekWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const Widget = nameToWidget[props.widgetInfo.widgetName as keyof typeof nameToWidget];
  if (!Widget) return;

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      props.renderWidget(<Widget {...(await buildWidgetProps())} />);
      break;
    }

    case 'WIDGET_CLICK': {
      if (props.clickAction === 'ADD_RECORD') {
        const type = props.clickActionData?.type as RecordType | undefined;
        if (type === 'sleep') {
          await toggleSleepFromWidget();
        } else if (type) {
          await addRecordFromWidget(type);
        }
      }
      props.renderWidget(<Widget {...(await buildWidgetProps())} />);
      break;
    }

    case 'WIDGET_DELETED':
    default:
      break;
  }
}
