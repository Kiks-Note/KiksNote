import React, {useState} from "react";
import Select from "react-dropdown-select";
import ExpandCircleDownRoundedIcon from "@mui/icons-material/ExpandCircleDownRounded";
import "../../styles/dropdown.css";
export const CustomDropdown = ({placeholder, data = [], onChange}) => {
  const [pressed, setPressed] = useState(false);

  const itemRenderer = ({item, itemIndex, state, methods}) => {
    return (
      <div
        className="dropdown-item"
        onClick={() => methods.addItem(item)}
        onMouseOver={() => {
          methods.activeCursorItem(itemIndex);
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontFamily: "poppins-regular",
              fontSize: 16,
              margin: 0,
            }}
          >
            {item.label}
          </p>
        </div>
      </div>
    );
  };

  const handleRenderer = ({}) => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          fontFamily: "poppins-regular",
        }}
      >
        <ExpandCircleDownRoundedIcon
          style={{
            width: 30,
            height: 30,
            transform: pressed ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.5s",
            color: "#1976d2",
          }}
        />
      </div>
    );
  };

  const contentRenderer = ({props, state}) => {
    return (
      <div>
        <p
          style={{
            fontFamily: "poppins-regular",
            fontSize: 18,
            margin: 0,
            // color: state.values.length === 0 && "#BDBDBD",
            // backgroundColor: "#F1F1F1",
          }}
        >
          {state.values.length === 0 ? placeholder : state.values[0].label}
        </p>
      </div>
    );
  };

  return (
    <Select
      placeholder={placeholder}
      options={data}
      style={{
        width: 250,
        border: "none",
        outline: "none",
        borderRadius: 5,
        // backgroundColor: "#F1F1F1",
        height: 35,
        padding: 10,
      }}
      onChange={onChange}
      onDropdownOpen={() => setPressed(true)}
      onDropdownClose={() => setPressed(false)}
      itemRenderer={itemRenderer}
      clearable={true}
      onClearAll={() => onChange([])}
      dropdownHandleRenderer={handleRenderer}
      contentRenderer={contentRenderer}
    />
  );
};
