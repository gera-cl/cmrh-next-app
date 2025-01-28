"use client";

import { useSession, signOut } from "next-auth/react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import clsx from "clsx";
import { TbCirclePlus, TbSearch } from "react-icons/tb";
import { Session } from "next-auth";
import { User } from "@heroui/user";
import { useReducer } from "react";

import { Logo } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";

const userMenu = (
  session: Session | null,
  status: "authenticated" | "loading" | "unauthenticated",
) => (
  <Dropdown placement="bottom-end">
    <DropdownTrigger>
      <Avatar
        isBordered
        as="button"
        className="transition-transform"
        name={session?.user.name}
        radius="lg"
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
            className=""
            description={
              <div className="max-w-28 break-words">{session?.user.email}</div>
            }
            name={session?.user.name}
          />
        </DropdownItem>
      </DropdownSection>

      <DropdownSection>
        <DropdownItem key="settings">Profile</DropdownItem>
        <DropdownItem key="configurations">Settings</DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
          Log Out
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  </Dropdown>
);

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
      <TbSearch className="text-base text-default-400 pointer-events-none flex-shrink-0" />
    }
    type="search"
  />
);

export const Navbar = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useReducer((current) => !current, false);

  return (
    <NextUINavbar
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
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
          startContent={<TbCirclePlus className="w-5 h-5" />}
          variant="solid"
        >
          Add Credential
        </Button>
      </NavbarContent>

      <NavbarContent as="div" className="hidden sm:flex" justify="end">
        <ThemeSwitch />
        {userMenu(session, status)}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link aria-label="New Credential" href={siteConfig.links.newCredential}>
          <TbCirclePlus className="text-default-500 w-6 h-6" />
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
                color="foreground"
                href={item.href}
                size="lg"
                onPress={() => setIsMenuOpen()}
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
