"use no memo";

import * as React from "react";
import {
  FlexWidget,
  TextWidget,
  type HexColor,
} from "react-native-android-widget";

import { RECORD_TYPES } from "@/constants/recordTypes";
import type { RecordType } from "@/types/record";

const QUICK_ADD_TYPES: RecordType[] = ["feed", "piss", "poop"];

const RECORD_EMOJI: Record<RecordType, string> = {
  feed: "🍼",
  piss: "💧",
  poop: "💩",
  sleep: "😴",
};

/** RECORD_TYPES colors are hex strings but typed loosely as `string`; the widget lib wants the `#…` literal type. */
function hex(color: string): HexColor {
  return color as HexColor;
}

export interface BebekWidgetRow {
  type: RecordType;
  text: string;
  hasRecord: boolean;
}

export interface BebekWidgetProps {
  babyName: string;
  rows: BebekWidgetRow[];
  activeSleepText: string | null;
  isSleeping: boolean;
  todaySummary: string;
}

const STOP_COLOR = "#B23B3B";

export function BebekWidget({
  babyName,
  rows,
  activeSleepText,
  isSleeping,
  todaySummary,
}: BebekWidgetProps) {
  const quickButtons = [
    ...QUICK_ADD_TYPES.map((type) => ({
      type,
      label: RECORD_TYPES[type].label,
      color: RECORD_TYPES[type].accent,
      showPlus: true,
    })),
    {
      type: "sleep" as RecordType,
      label: isSleeping ? "Durdur" : "Uyku",
      color: isSleeping ? STOP_COLOR : RECORD_TYPES.sleep.accent,
      showPlus: !isSleeping,
    },
  ];

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: "#F2F0E3",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#DCD8C3",
        padding: 12,
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <FlexWidget
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "match_parent",
        }}
      >
        <FlexWidget
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
        >
          <TextWidget
            text={babyName ? `Selam, ${babyName}! 👶` : "Selam! 👋"}
            truncate="END"
            maxLines={1}
            style={{ fontSize: 14, fontWeight: "800", color: "#1C1B16" }}
          />
        </FlexWidget>
        <FlexWidget
          clickAction="REFRESH"
          accessibilityLabel="Widget'ı yenile"
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: "#E9E6D5",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextWidget
            text="↻"
            style={{ fontSize: 16, fontWeight: "800", color: "#4B5723" }}
          />
        </FlexWidget>
      </FlexWidget>

      <TextWidget
        text={todaySummary}
        truncate="END"
        maxLines={1}
        style={{ fontSize: 10, fontWeight: "600", color: "#8D8975", marginTop: 3 }}
      />

      {activeSleepText ? (
        <FlexWidget
          style={{
            width: "wrap_content",
            backgroundColor: "#E6E5EE",
            borderRadius: 10,
            paddingHorizontal: 8,
            paddingVertical: 3,
            marginTop: 6,
          }}
        >
          <TextWidget
            text={activeSleepText}
            style={{ fontSize: 11, fontWeight: "700", color: "#6E6B8F" }}
          />
        </FlexWidget>
      ) : null}

      {/* Record rows */}
      <FlexWidget
        style={{
          flexDirection: "column",
          width: "match_parent",
          marginTop: 10,
        }}
      >
        {rows.map((row, index) => {
          const meta = RECORD_TYPES[row.type];
          return (
            <FlexWidget
              key={row.type}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: index === rows.length - 1 ? 0 : 5,
              }}
            >
              <FlexWidget
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: hex(meta.accentBg),
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 6,
                }}
              >
                <TextWidget
                  text={RECORD_EMOJI[row.type]}
                  style={{ fontSize: 9 }}
                />
              </FlexWidget>
              <FlexWidget style={{ flex: 1 }}>
                <TextWidget
                  text={row.text}
                  truncate="END"
                  maxLines={1}
                  style={{
                    fontSize: 12,
                    fontWeight: row.hasRecord ? "700" : "500",
                    color: row.hasRecord ? hex(meta.accent) : "#8D8975",
                  }}
                />
              </FlexWidget>
            </FlexWidget>
          );
        })}
      </FlexWidget>

      {/* Quick add */}
      <FlexWidget
        style={{ flexDirection: "row", width: "match_parent", marginTop: 10 }}
      >
        {quickButtons.map((button, index) => (
          <FlexWidget
            key={button.type}
            clickAction="ADD_RECORD"
            clickActionData={{ type: button.type }}
            accessibilityLabel={`${button.label} ekle`}
            style={{
              flex: 1,
              marginLeft: index === 0 ? 0 : 3,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: hex(button.color),
              borderRadius: 14,
              paddingVertical: 9,
            }}
          >
            {button.showPlus ? (
              <TextWidget
                text="+ "
                style={{ fontSize: 12, fontWeight: "800", color: "#FFFFFF" }}
              />
            ) : null}
            <TextWidget
              text={button.label}
              truncate="END"
              maxLines={1}
              style={{ fontSize: 12, fontWeight: "800", color: "#FFFFFF" }}
            />
          </FlexWidget>
        ))}
      </FlexWidget>
    </FlexWidget>
  );
}
