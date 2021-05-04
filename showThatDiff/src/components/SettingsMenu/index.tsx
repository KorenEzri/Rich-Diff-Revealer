import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}));
const popUpOptions = [
  "Pop up options",
  "Show pixel-perfect diff image",
  "Show auto-swipe-view",
];
enum popupOptions {
  TWO_UP = 2,
  PIXEL_PERFECT,
  AUTO_SWIPE,
}
const sendPopupOptionsUpdate = (option: number) => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const activeTab: number | undefined = tabs[0].id;
    if (activeTab && option) {
      localStorage.setItem("popup_opts", `${option}`);
      chrome.tabs.sendMessage(activeTab, { message: "popupOptions", option:`${option}` });
    }
  });
};

export const SettingsMenu = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(
    Number(localStorage.getItem("popup_opts")) || popupOptions.PIXEL_PERFECT
  );
  const handleClickListItem = (event: {
    currentTarget: React.SetStateAction<null>;
  }) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: React.SetStateAction<number>
  ) => {
    setSelectedIndex(index);
    switch (index) {
      case 1:
        sendPopupOptionsUpdate(popupOptions.TWO_UP);
        break;
      case 2:
        sendPopupOptionsUpdate(popupOptions.PIXEL_PERFECT);
        break;
      case 3:
        sendPopupOptionsUpdate(popupOptions.AUTO_SWIPE);
        break;
      default:
        break;
    }
    setAnchorEl(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="Popup settings">
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="When popup is enabled"
          // @ts-ignore
          onClick={handleClickListItem}
        >
          <ListItemText
            primary="When popup is enabled"
            secondary={popUpOptions[selectedIndex]}
          />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {popUpOptions.map((option, index) => (
          <MenuItem
            key={option}
            disabled={index === 0}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
