'use no memo';

import * as React from 'react';
import { FlexWidget, TextWidget, type HexColor } from 'react-native-android-widget';

import { darkColors, darkRecordColors, lightColors, lightRecordColors } from '@/theme/colors';
import type { RecordType } from '@/types/record';

const RECORD_EMOJI: Record<RecordType, string> = {
  feed: '🍼',
  piss: '💧',
  poop: '💩',
  sleep: '😴',
};

/** Theme colors are plain hex strings; the widget lib wants the `#…` literal type. */
function hex(color: string): HexColor {
  return color as HexColor;
}

export interface BebekWidgetRow {
  type: RecordType;
  text: string;
  hasRecord: boolean;
}

export interface BebekWidgetQuickButton {
  type: RecordType;
  label: string;
  color: string;
  showPlus: boolean;
}

export interface BebekWidgetProps {
  scheme: 'light' | 'dark';
  greeting: string;
  refreshLabel: string;
  rows: BebekWidgetRow[];
  activeSleepText: string | null;
  todaySummary: string;
  quickButtons: BebekWidgetQuickButton[];
}

export function BebekWidget({
  scheme,
  greeting,
  refreshLabel,
  rows,
  activeSleepText,
  todaySummary,
  quickButtons,
}: BebekWidgetProps) {
  const palette = scheme === 'dark' ? darkColors : lightColors;
  const recordColors = scheme === 'dark' ? darkRecordColors : lightRecordColors;
  const sleepColors = recordColors.sleep;

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: hex(palette.surface),
        borderRadius: 22,
        borderWidth: 1,
        borderColor: hex(palette.border),
        padding: 10,
        flexDirection: 'column',
      }}
    >
      {/* Greeting */}
      <TextWidget
        text={greeting}
        truncate="END"
        maxLines={1}
        style={{ fontSize: 13, fontWeight: '800', color: hex(palette.ink) }}
      />

      {/* Today summary + refresh */}
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', width: 'match_parent', marginTop: 2 }}>
        <FlexWidget style={{ flex: 1 }}>
          <TextWidget
            text={todaySummary}
            truncate="END"
            maxLines={1}
            style={{ fontSize: 10, fontWeight: '600', color: hex(palette.muted) }}
          />
        </FlexWidget>
        <FlexWidget
          clickAction="REFRESH"
          accessibilityLabel={refreshLabel}
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: hex(palette.surfaceElevated),
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 6,
          }}
        >
          <TextWidget text="↻" style={{ fontSize: 14, fontWeight: '800', color: hex(palette.primary) }} />
        </FlexWidget>
      </FlexWidget>

      {activeSleepText ? (
        <FlexWidget
          style={{
            width: 'wrap_content',
            backgroundColor: hex(sleepColors.accentBg),
            borderRadius: 9,
            paddingHorizontal: 7,
            paddingVertical: 2,
            marginTop: 4,
          }}
        >
          <TextWidget
            text={activeSleepText}
            style={{ fontSize: 10, fontWeight: '700', color: hex(sleepColors.accent) }}
          />
        </FlexWidget>
      ) : null}

      {/* Record rows */}
      <FlexWidget style={{ flexDirection: 'column', width: 'match_parent', marginTop: 6 }}>
        {rows.map((row, index) => {
          const rowColors = recordColors[row.type];
          return (
            <FlexWidget
              key={row.type}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: index === rows.length - 1 ? 0 : 3,
              }}
            >
              <FlexWidget
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: hex(rowColors.accentBg),
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 6,
                }}
              >
                <TextWidget text={RECORD_EMOJI[row.type]} style={{ fontSize: 8 }} />
              </FlexWidget>
              <FlexWidget style={{ flex: 1 }}>
                <TextWidget
                  text={row.text}
                  truncate="END"
                  maxLines={1}
                  style={{
                    fontSize: 11,
                    fontWeight: row.hasRecord ? '700' : '500',
                    color: row.hasRecord ? hex(rowColors.accent) : hex(palette.muted),
                  }}
                />
              </FlexWidget>
            </FlexWidget>
          );
        })}
      </FlexWidget>

      {/* Quick add */}
      <FlexWidget style={{ flexDirection: 'row', width: 'match_parent', marginTop: 6 }}>
        {quickButtons.map((button, index) => (
          <FlexWidget
            key={button.type}
            clickAction="ADD_RECORD"
            clickActionData={{ type: button.type }}
            accessibilityLabel={button.label}
            style={{
              flex: 1,
              marginLeft: index === 0 ? 0 : 3,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: hex(button.color),
              borderRadius: 13,
              paddingVertical: 6,
            }}
          >
            {button.showPlus ? (
              <TextWidget text="+ " style={{ fontSize: 11, fontWeight: '800', color: '#FFFFFF' }} />
            ) : null}
            <TextWidget
              text={button.label}
              truncate="END"
              maxLines={1}
              style={{ fontSize: 11, fontWeight: '800', color: '#FFFFFF' }}
            />
          </FlexWidget>
        ))}
      </FlexWidget>
    </FlexWidget>
  );
}
