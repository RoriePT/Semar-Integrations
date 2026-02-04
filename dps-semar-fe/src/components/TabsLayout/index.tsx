import { Tabs } from "@mantine/core";
import { useState } from "react";

const TabsLayout = ({
  tabs,
  currentValue,
  tabPanels,
  tabsInSingleLine = true,
  isControlled = true,
  onChange = (v) => {},
}) => {
  const tabWidth = `${100 / tabs.length}%`;

  const [innerValue, setInnerValue] = useState(currentValue);

  return (
    <Tabs
      value={isControlled ? currentValue : innerValue}
      onChange={(v) => {
        if (isControlled) onChange(v);
        else setInnerValue(v);
      }}
    >
      {tabs.some((tab) => tab.label) && (
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Tab
              w={tabsInSingleLine ? tabWidth : "auto"}
              value={tab.value}
            >
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      )}

      {tabPanels.map((panel, index) => (
        <Tabs.Panel
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            paddingTop: "20px",
            paddingBottom: "20px",
          }}
          value={tabs[index].value}
        >
          {panel}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

export default TabsLayout;
