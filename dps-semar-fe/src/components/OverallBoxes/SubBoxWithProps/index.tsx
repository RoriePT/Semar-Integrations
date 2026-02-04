import { Divider, Grid } from "@mantine/core";
import React from "react";
import SubBox from "../SubBox";

const SubBoxWithProps = ({
  items,
  isTablet,
  showHrForLastItem = false,
  dividerLine = false,
  isForAmount=false,
}) => {
  const totalColumns = 12;

  let cumulativeSpan = 0;
  let lastRowStartIndex = 0;

  items.forEach((item, index) => {
    cumulativeSpan += item.colSpan;
    if (cumulativeSpan > totalColumns) {
      lastRowStartIndex = index;
      cumulativeSpan = item.colSpan;
    }
  });
  return (
    <>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <Grid.Col span={item.colSpan}>
            <SubBox
              amount={item.amount}
              subHeading={item.subHeading}
              dividerLine={dividerLine ? true : index < lastRowStartIndex}
              isForAmount={item.isForAmount}
            />
          </Grid.Col>

          {(index < items.length - 1 || showHrForLastItem) && (
            <hr
              style={{
                borderColor: "#D9D9D9",
                margin: "12px 0",
                opacity: "0.3",
                width: isTablet ? "100%" : "auto",
              }}
            ></hr>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default SubBoxWithProps;
