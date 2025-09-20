import { Menu } from "lucide-react";
import { ReactNode } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import LaunchUI from "@/components/logos/launch-ui";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "@/components/ui/navbar";
import Navigation from "@/components/ui/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavbarLink {
  text: string;
  href: string;
}

interface NavbarActionProps {
  text: string;
  href: string;
  variant?: ButtonProps["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
  isButton?: boolean;
}

interface NavbarProps {
  logo?: ReactNode;
  name?: string;
  homeUrl?: string;
  mobileLinks?: NavbarLink[];
  actions?: NavbarActionProps[];
  showNavigation?: boolean;
  customNavigation?: ReactNode;
  className?: string;
}

export default function Navbar({
  logo = <LaunchUI />,
  name = "Launch UI",
  homeUrl = siteConfig.url,
  mobileLinks = [
    { text: "Getting Started", href: siteConfig.url },
    { text: "Components", href: siteConfig.url },
    { text: "Documentation", href: siteConfig.url },
  ],
  actions = [
    {
      text: "Sign in",
      href: siteConfig.url,
      isButton: true,
      variant: "outline",
    },
    {
      text: "Get Started",
      href: siteConfig.url,
      isButton: true,
      variant: "outline",
    },
  ],
  showNavigation = true,
  customNavigation,
  className,
}: NavbarProps) {
  return (
    <header className={cn("sticky top-0 z-50 -mb-4 px-4 pb-4", className)}>
      <div className="fade-bottom bg-background/15 absolute left-0 h-20 w-full backdrop-blur-lg"></div>
      <div className="pt-2 max-w-container relative mx-auto">
        <NavbarComponent>
          <NavbarLeft>
            <a
              href={homeUrl}
              className="flex items-center gap-2 text-xl font-bold text-black"
            >
              {logo}
              {name}
            </a>
            {/* {showNavigation && (customNavigation || <div className="text-black font-semibold [&_*]:text-black [&_*]:font-semibold [&_a]:text-black [&_a]:font-semibold [&_button]:text-black [&_button]:font-semibold"><Navigation /></div>)} */}
          </NavbarLeft>
          <NavbarRight>
            {actions.map((action, index) =>
              action.isButton ? (
                <a
                  key={index}
                  href={action.href}
                  className="px-4 py-2 border border-black text-black rounded-md hover:bg-black hover:text-white transition-all duration-200"
                >
                  {action.icon}
                  {action.text}
                  {action.iconRight}
                </a>
              ) : (
                <a
                  key={index}
                  href={action.href}
                  className="text-lg text-black"
                >
                  {action.text}
                </a>
              )
            )}
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
}