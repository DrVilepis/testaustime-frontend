import { Anchor, Box, Burger, Button, createStyles, Divider, Group, Menu, useMantineColorScheme } from "@mantine/core";
import {
  EnterIcon, ExitIcon, FaceIcon, GearIcon, HomeIcon, MixIcon, PersonIcon, PlusIcon
} from "@radix-ui/react-icons";
import { BarChart2 } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/useAuthentication";
import { useI18nContext } from "../i18n/i18n-react";
import ThemeToggle from "./ThemeToggle/ThemeToggle";

const useStyles = createStyles(theme => ({
  navigation: {
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      display: "none"
    }
  },
  smallNavigation: {
    display: "none",
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      display: "flex"
    },
    "@media (max-width: 450px)": {
      width: "39%"
    }
  },
  spacer: {
    width: "10px",
    height: "1px",
    backgroundColor: theme.colorScheme === "dark" ? "#bbb" : "#333"
  },
  dropdown: {
    width: "90%",
    margin: "calc(40px + 36px + 20px) 5% 0 5%",
    padding: "10px",
    zIndex: 5
  }
}));

export interface NavigationProps {
  opened: boolean,
  setOpened: (o: boolean | ((arg0: boolean) => boolean)) => void
}

export const Navigation = ({
  opened,
  setOpened
}: NavigationProps) => {
  const { LL } = useI18nContext();
  const { isLoggedIn, username, logOut } = useAuthentication();
  const navigate = useNavigate();

  const { toggleColorScheme } = useMantineColorScheme();

  const { classes } = useStyles();

  const logOutAndRedirect = () => {
    logOut();
    navigate("/");
  };

  return <Group>
    <Group spacing={15} align="center" className={classes.navigation}>
      <Group>
        {isLoggedIn ? <>
          <Anchor component={Link} to="/">{LL.navbar.dashboard()}</Anchor>
          <Anchor component={Link} to="/friends">{LL.navbar.friends()}</Anchor>
          <Anchor component={Link} to="/leaderboards">{LL.navbar.leaderboards()}</Anchor>
          <Menu
            trigger="hover"
          >
            <Menu.Target>
              <Button
                variant="outline"
                size="xs"
                leftIcon={<PersonIcon style={{ marginRight: "5px" }} />}
              >
                {username}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{LL.navbar.account()}</Menu.Label>
              <Menu.Item component={Link} to="/profile" icon={<GearIcon />}>{LL.navbar.settings()}</Menu.Item>
              <Divider />
              <Menu.Item component={Link} to="/extensions" icon={<MixIcon />}>
                {LL.navbar.extensions()}
              </Menu.Item>
              <Divider />
              <Menu.Item
                color="blue"
                icon={<ExitIcon />}
                onClick={logOutAndRedirect}>
                {LL.navbar.logOut()}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </> : <>
          <Anchor component={Link} to="/extensions">{LL.navbar.extensions()}</Anchor>
          <Box className={classes.spacer} />
          <Anchor component={Link} to="/login">{LL.navbar.login()}</Anchor>
          <Button component={Link} to="/register">{LL.navbar.register()}</Button>
        </>}
      </Group>
      <ThemeToggle label={false} />
    </Group>
    <Group className={classes.smallNavigation}>
      <Menu
        opened={opened}
        id="dropdown-menu"
        transitionProps={{
          transition: "fade",
          duration: 150
        }}
        position={"left-end"}
      >
        <Menu.Target>
          <Burger
            title="Open navigation"
            opened={opened}
            color={"#536ab7"}
            sx={{ zIndex: 5 }}
            onClick={() => setOpened((o: boolean) => !o)}
          />
        </Menu.Target>
        <Menu.Dropdown
          className={`${classes.dropdown} noDefaultTransition`}
          onClick={() => setOpened(false)}
        >
          <div
            style={{ padding: "10px" }}
            onClick={() => { toggleColorScheme(); }}>
            <ThemeToggle label={true} />
          </div>
          {isLoggedIn ?
            <>
              <Divider />
              <Menu.Item component={Link} to="/" icon={<HomeIcon />}>{LL.navbar.dashboard()}</Menu.Item>
              <Menu.Item component={Link} to="/friends" icon={<FaceIcon />}>{LL.navbar.friends()}</Menu.Item>
              <Menu.Item
                component={Link}
                to="/leaderboards"
                icon={<BarChart2 size={18} />}
              >
                {LL.navbar.leaderboards()}
              </Menu.Item>
              <Divider />
              <Menu.Label>{LL.navbar.account()} - {username}</Menu.Label>
              <Menu.Item component={Link} to="/profile" icon={<GearIcon />}>{LL.navbar.settings()}</Menu.Item>
              <Divider />
              <Menu.Item component={Link} to="/extensions" icon={<MixIcon />}>
                {LL.navbar.extensions()}
              </Menu.Item>
              <Divider />
              <Menu.Item color="blue" icon={<ExitIcon />} onClick={logOutAndRedirect}>
                {LL.navbar.logOut()}
              </Menu.Item>
            </>
            :
            <>
              <Divider />
              <Menu.Item component={Link} to="/login" icon={<EnterIcon />}>{LL.navbar.login()}</Menu.Item>
              <Menu.Item color="blue" component={Link} to="/register" icon={<PlusIcon />}>
                {LL.navbar.register()}
              </Menu.Item>
              <Divider />
              <Menu.Item component={Link} to="/extensions" icon={<MixIcon />}>
                {LL.navbar.extensions()}
              </Menu.Item>
            </>}
        </Menu.Dropdown>
      </Menu>
    </Group>
  </Group>;
};
