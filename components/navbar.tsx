"use client";

import { useSession, signOut } from "next-auth/react"
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@nextui-org/dropdown";
import { Avatar } from "@nextui-org/avatar";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";
import { PiPlusCircleDuotone } from "react-icons/pi";

import { Session } from "next-auth";
import { User } from "@nextui-org/user";

const userMenu = (session: Session | null, status: "authenticated" | "loading" | "unauthenticated") => (
  <Dropdown placement="bottom-end">
    <DropdownTrigger>
      <Avatar
        isBordered
        as="button"
        className="transition-transform"
        radius="lg"
        name={session?.user.name}
        size="sm"
        src={session?.user.image}
      />
    </DropdownTrigger>
    <DropdownMenu aria-label="Profile Actions" variant="flat">
      <DropdownSection showDivider>
        <DropdownItem key="profile" textValue="user">
          <User
            avatarProps={{
              src: session?.user.image,
            }}
            description={
              <div className="max-w-28 break-words">
                {session?.user.email}
              </div>
            }
            name={session?.user.name}
            className=""
          />
        </DropdownItem>
      </DropdownSection>

      <DropdownSection >
        <DropdownItem key="settings">Profile</DropdownItem>
        <DropdownItem key="configurations">Settings</DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
          Log Out
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  </Dropdown>
)

const searchInput = (
  <Input
    aria-label="Search"
    classNames={{
      inputWrapper: "bg-default-100",
      input: "text-sm",
    }}
    endContent={
      <Kbd className="hidden lg:inline-block" keys={["command"]}>
        K
      </Kbd>
    }
    labelPlacement="outside"
    placeholder="Search..."
    startContent={
      <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
    }
    type="search"
  />
);

export const Navbar = () => {
  const { data: session, status } = useSession()

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">CUMORAH</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden sm:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
        <Button
          as={Link}
          className="hidden sm:flex ml-2 text-sm font-semibold bg-slate-100 text-slate-700"
          href={siteConfig.links.newCredential}
          startContent={<PiPlusCircleDuotone className="w-5 h-5" />}
          variant="solid"
        >
          Add Credential
        </Button>
      </NavbarContent>

      {/* <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            Sponsor
          </Button>
        </NavbarItem>
      </NavbarContent> */}

      <NavbarContent
        className="hidden sm:flex"
        as="div"
        justify="end"
      >
        <ThemeSwitch />
        {userMenu(session, status)}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link aria-label="New Credential" href={siteConfig.links.newCredential}>
          <PiPlusCircleDuotone className="text-default-500 w-6 h-6" />
        </Link>
        <ThemeSwitch />
        {userMenu(session, status)}
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                href={item.href}
                color="foreground"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
