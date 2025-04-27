import * as React from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import "./styles.css";
import List from "../List";
import { convertNumber } from "../../../functions/convertNumber";
import Button from "../../Common/Button";

export default function TabsComponent({ coins, setSearch }) {
  const [value, setValue] = React.useState("list");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const style = {
    color: "var(--white)",
    "& .Mui-selected": {
      color: "var(--white) !important",
    },
    fontFamily: "Inter,sans-serif",
    fontWeight: 600,
    textTransform: "capitalize",
  };

  return (
    <TabContext value={value}>
      {/* <div style={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChange} variant="fullWidth">
          <Tab label="# Name Price 24h % Price Market Cap Volume(24h)" value="list" sx={style} />
        </TabList>
      </div> */}
      <TabPanel value="list">
        <table className="list-flex">
          <thead>
            <tr className="list-header">
              <th /> 
              <th className="td-info">Name</th>
              <th>24h %</th>
              <th className="td-current-price">Price</th>
              <th className="td-totalVolume">Volume(24h)</th>
              <th className="td-marketCap">Market Cap</th>
              <th />                              
            </tr>
          </thead>
          {coins.length > 0 ? (
            coins.map((coin, i) => (
              <List coin={coin} key={i} delay={(i % 8) * 0.2} />
            ))
          ) : (
            <div>
              <h1 style={{ textAlign: "center" }}>
                Sorry, Couldn't find the coin you're looking for 😞
              </h1>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "2rem",
                }}
              >
                <Button text="Clear Search" onClick={() => setSearch("")} />
              </div>
            </div>
          )}
        </table>
      </TabPanel>
    </TabContext>
  );
}
