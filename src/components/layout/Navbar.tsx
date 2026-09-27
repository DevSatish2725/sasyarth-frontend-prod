"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ChevronDown,
  Heart,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Store,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useAuth } from "@/providers/AuthProvider";

import LanguageSwitcher from "../common/LanguageSwitcher";
import { NavLink } from "./NavLink";
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuCloseRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const { user, isLoading, logout } = useAuth();

  const isAuthenticated = Boolean(user);
  const isSeller = Boolean(user?.sellerProfile);
  const userName = user?.fullName ?? "";

  const initials = userName
    ? userName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((item) => item[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const becomeSellerHref = isAuthenticated
    ? "/become-seller"
    : `/login?returnTo=${encodeURIComponent("/become-seller")}`;

  const isRegisterActive =
    pathname === "/register" || pathname.startsWith("/register/");

  useEffect(() => {
    if (!isProfileOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      mobileMenuCloseRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (isMenuOpen) {
        setIsMenuOpen(false);
        window.requestAnimationFrame(() => {
          mobileMenuTriggerRef.current?.focus();
        });
      }

      if (isProfileOpen) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen, isProfileOpen]);

  const closeMobileMenu = (restoreFocus = false) => {
    setIsMenuOpen(false);

    if (restoreFocus) {
      window.requestAnimationFrame(() => {
        mobileMenuTriggerRef.current?.focus();
      });
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);
      await logout();
      setIsMenuOpen(false);
      setIsProfileOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-40 border-b border-border/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-3 sm:px-4 lg:h-[72px] lg:px-8">
          <div className="lg:hidden">
            <NavbarLogo compact />
          </div>

          <div className="hidden lg:block">
            <NavbarLogo />
          </div>

          <div className="h-10 w-24 animate-pulse rounded-xl bg-surface-muted sm:w-32" />
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-white/95 shadow-[0_1px_2px_rgba(0,0,0,0.02)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-3 sm:px-4 lg:h-[72px] lg:px-8">
          <div className="lg:hidden">
            <NavbarLogo compact />
          </div>

          <div className="hidden lg:block">
            <NavbarLogo />
          </div>
          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <nav
              aria-label="Primary navigation"
              className="ml-8 flex items-center gap-1"
            >
              <NavLink
                href="/sellers"
                icon={<Store className="h-4.5 w-4.5" />}
              >
                {t("findSellers")}
              </NavLink>

              {isSeller ? (
                <NavLink
                  href="/seller/dashboard"
                  activePath="/seller"
                  icon={<LayoutDashboard className="h-[18px] w-[18px]" />}
                >
                  {t("sellerDashboard")}
                </NavLink>
              ) : (
                <NavLink
                  href={becomeSellerHref}
                  activePath="/become-seller"
                  icon={<UserPlus className="h-4.5 w-4.5" />}
                >
                  {t("becomeSeller")}
                </NavLink>
              )}
            </nav>

            <LanguageSwitcher />

            <div aria-hidden="true" className="mx-1 h-6 w-px bg-border" />

            {!isAuthenticated ? (
              <>
                <NavLink href="/login" icon={<></>}>
                  {t("login")}
                </NavLink>

                <Link
                  href="/register"
                  aria-current={isRegisterActive ? "page" : undefined}
                  className={`
                    inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4
                    text-sm font-bold transition-all duration-200
                    ${
                      isRegisterActive
                        ? "bg-primary-hover text-white ring-2 ring-primary/20 ring-offset-2"
                        : "bg-primary text-white shadow-sm hover:bg-primary-hover hover:shadow-md"
                    }
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-primary/30 focus-visible:ring-offset-2
                  `}
                >
                  <UserPlus className="h-4 w-4" />
                  {t("register")}
                </Link>
              </>
            ) : (
              <div ref={profileMenuRef} className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isProfileOpen}
                  aria-label="Open account menu"
                  onClick={() => setIsProfileOpen((previous) => !previous)}
                  className="group flex h-11 items-center gap-2.5 rounded-xl px-2 transition duration-200 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  <UserAvatar initials={initials} size="small" />

                  <div className="hidden min-w-0 text-left xl:block">
                    <p className="max-w-36 truncate text-sm font-semibold leading-5 text-text-primary">
                      {userName || "My Account"}
                    </p>
                    <p className="text-[11px] leading-4 text-text-secondary">
                      {isSeller ? t("sellerAccount") : t("buyerAccount")}
                    </p>
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div
                    role="menu"
                    aria-label="Account menu"
                    className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-border/80 bg-white p-2 shadow-xl shadow-black/5"
                  >
                    <div className="flex items-center gap-3 rounded-xl bg-surface-muted px-3 py-3">
                      <UserAvatar initials={initials} size="medium" />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-text-primary">
                          {userName || "My Account"}
                        </p>
                        <p className="mt-0.5 text-xs text-text-secondary">
                          {isSeller ? t("sellerAccount") : t("buyerAccount")}
                        </p>
                      </div>
                    </div>

                    <MenuDivider />

                    <ProfileMenuLink
                      href="/profile"
                      icon={<UserRound className="h-4 w-4" />}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {t("myProfile")}
                    </ProfileMenuLink>

                    {isSeller && (
                      <ProfileMenuLink
                        href="/seller/dashboard"
                        icon={<LayoutDashboard className="h-4 w-4" />}
                        onClick={() => setIsProfileOpen(false)}
                      >
                        {t("sellerDashboard")}
                      </ProfileMenuLink>
                    )}

                    <ProfileMenuLink
                      href="/saved-sellers"
                      icon={<Heart className="h-4 w-4" />}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {t("savedSellers")}
                    </ProfileMenuLink>

                    <MenuDivider />

                    <button
                      type="button"
                      role="menuitem"
                      disabled={isLoggingOut}
                      onClick={handleLogout}
                      className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold text-error transition duration-150 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1 lg:hidden">
            {isAuthenticated && (
              <Link
                href="/profile"
                aria-label={t("myProfile")}
                className="flex h-11 w-11 items-center justify-center rounded-full transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <UserAvatar initials={initials} size="small" />
              </Link>
            )}

            <button
              ref={mobileMenuTriggerRef}
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-text-primary transition active:scale-95 active:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <Menu className="h-[22px] w-[22px]" />
            </button>
          </div>
        </div>
      </header>

      <MobileBottomNavigation
        pathname={pathname}
        isAuthenticated={isAuthenticated}
        isSeller={isSeller}
        becomeSellerHref={becomeSellerHref}
      />
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => closeMobileMenu(true)}
            className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-[2px]"
          />

          <aside
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="absolute right-0 top-0 flex h-[100dvh] w-[86%] max-w-[340px] flex-col overflow-y-auto overscroll-contain bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl"
          >
            <div className="flex min-h-16 items-center justify-between border-b border-border/70 px-4">
              <NavbarLogo compact onClick={() => closeMobileMenu(false)} />

              <button
                ref={mobileMenuCloseRef}
                type="button"
                aria-label="Close menu"
                onClick={() => closeMobileMenu(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-text-primary transition hover:bg-surface-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col px-4 pb-5">
              {isAuthenticated && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary-light/70 p-3.5">
                  <UserAvatar initials={initials} size="large" />

                  <div className="min-w-0">
                    <p className="truncate font-bold text-text-primary">
                      {userName || "My Account"}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-text-secondary">
                      {isSeller ? t("sellerAccount") : t("buyerAccount")}
                    </p>
                  </div>
                </div>
              )}

              <nav className="mt-4 flex flex-col gap-1" aria-label="Account navigation">
                {isAuthenticated ? (
                  <>
                    <MobileNavLink
                      href="/profile"
                      pathname={pathname}
                      icon={<UserRound className="h-5 w-5" />}
                      onClick={() => closeMobileMenu(false)}
                    >
                      {t("myProfile")}
                    </MobileNavLink>

                    {isSeller ? (
                      <MobileNavLink
                        href="/seller/dashboard"
                        activePath="/seller"
                        pathname={pathname}
                        icon={<LayoutDashboard className="h-5 w-5" />}
                        onClick={() => closeMobileMenu(false)}
                      >
                        {t("sellerDashboard")}
                      </MobileNavLink>
                    ) : (
                      <MobileNavLink
                        href={becomeSellerHref}
                        activePath="/become-seller"
                        pathname={pathname}
                        icon={<UserPlus className="h-5 w-5" />}
                        onClick={() => closeMobileMenu(false)}
                      >
                        {t("becomeSeller")}
                      </MobileNavLink>
                    )}

                    <MobileNavLink
                      href="/saved-sellers"
                      pathname={pathname}
                      icon={<Heart className="h-5 w-5" />}
                      onClick={() => closeMobileMenu(false)}
                    >
                      {t("savedSellers")}
                    </MobileNavLink>

                    <MenuDivider />

                    <div className="rounded-xl px-2 py-2">
                      <LanguageSwitcher />
                    </div>

                    <MenuDivider />

                    <button
                      type="button"
                      disabled={isLoggingOut}
                      onClick={handleLogout}
                      className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 font-semibold text-error transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <LogOut className="h-5 w-5" />
                      {t("logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <MobileNavLink
                      href={becomeSellerHref}
                      activePath="/become-seller"
                      pathname={pathname}
                      icon={<UserPlus className="h-5 w-5" />}
                      onClick={() => closeMobileMenu(false)}
                    >
                      {t("becomeSeller")}
                    </MobileNavLink>

                    <div className="rounded-xl px-2 py-2">
                      <LanguageSwitcher />
                    </div>

                    <MenuDivider />

                    <MobileNavLink
                      href="/login"
                      pathname={pathname}
                      icon={<LogIn className="h-5 w-5" />}
                      onClick={() => closeMobileMenu(false)}
                    >
                      {t("login")}
                    </MobileNavLink>

                    <Link
                      href="/register"
                      onClick={() => closeMobileMenu(false)}
                      className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 font-bold text-white shadow-sm transition duration-200 hover:bg-primary-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
                    >
                      <UserPlus className="h-5 w-5" />
                      {t("register")}
                    </Link>
                  </>
                )}
              </nav>

              <div className="mt-auto pt-8">
                <div className="flex items-center justify-center rounded-2xl border border-primary/10 bg-primary-light/60 p-4 text-center text-sm">
                  <p className="border-r border-gray-300 pr-2 font-bold text-primary">
                    {t("freshConnections")}
                  </p>
                  <p className="pl-2 font-bold text-accent">
                    {t("strongerCommunities")}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

/* ========================================================= */
/* Navbar Logo                                               */
/* ========================================================= */

interface NavbarLogoProps {
  onClick?: () => void;
  compact?: boolean;
}

function NavbarLogo({ onClick, compact = false }: NavbarLogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Sasyarth home"
      className="group flex shrink-0 items-center"
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-xl transition-transform duration-200 group-hover:scale-[1.03] ${
          compact ? "h-10 w-10" : "h-16 w-16"
        }`}
      >
        <Image
          src="/sasyarth_image_logo_dark_new.webp"
          alt=""
          fill
          priority
          sizes={compact ? "40px" : "64px"}
          className="object-contain"
        />
      </div>

      <div className="text-center">
        <p
          className={`font-bold leading-none text-[#02462A] ${
            compact ? "text-xl" : "text-3xl"
          }`}
        >
          Sasyarth
        </p>
        <p
          className={`whitespace-nowrap font-bold tracking-[0.02em] text-[#CCA141] ${
            compact ? "mt-1 text-[8px]" : "mt-0.5 text-[12px]"
          }`}
        >
          कृष्या समृद्धिः
        </p>
      </div>
    </Link>
  );
}

/* ========================================================= */
/* Avatar                                                    */
/* ========================================================= */

interface UserAvatarProps {
  initials: string;
  size?: "small" | "medium" | "large";
}

function UserAvatar({ initials, size = "small" }: UserAvatarProps) {
  const sizeClasses = {
    small: "h-9 w-9 text-sm",
    medium: "h-10 w-10 text-sm",
    large: "h-11 w-11 text-sm",
  };

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-primary-light font-bold text-primary ring-1 ring-primary/10 ${sizeClasses[size]}`}
    >
      {initials}
    </span>
  );
}

/* ========================================================= */
/* Desktop profile menu item                                 */
/* ========================================================= */

interface ProfileMenuLinkProps {
  href: string;
  children: ReactNode;
  icon: ReactNode;
  onClick?: () => void;
}

function ProfileMenuLink({
  href,
  children,
  icon,
  onClick,
}: ProfileMenuLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      role="menuitem"
      className="group flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-text-primary transition duration-150 hover:bg-primary-light hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
    >
      <span className="shrink-0 text-text-secondary transition-colors group-hover:text-primary">
        {icon}
      </span>
      <span className="min-w-0 truncate">{children}</span>
    </Link>
  );
}
function MenuDivider() {
  return <div aria-hidden="true" className="my-2 h-px bg-border" />;
}

/* ========================================================= */
/* Mobile drawer navigation item                             */
/* ========================================================= */

interface MobileNavLinkProps {
  href: string;
  children: ReactNode;
  icon: ReactNode;
  pathname: string;
  activePath?: string;
  onClick: () => void;
}

function MobileNavLink({
  href,
  children,
  icon,
  pathname,
  activePath,
  onClick,
}: MobileNavLinkProps) {
  const pathToCheck = activePath ?? href.split("?")[0];
  const isActive =
    pathname === pathToCheck || pathname.startsWith(`${pathToCheck}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`group flex min-h-12 items-center gap-3 rounded-xl px-3 font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
        isActive
          ? "bg-primary-light text-primary"
          : "text-text-primary hover:bg-primary-light hover:text-primary"
      }`}
    >
      <span
        className={`shrink-0 transition-colors ${
          isActive
            ? "text-primary"
            : "text-text-secondary group-hover:text-primary"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 truncate">{children}</span>
    </Link>
  );
}

/* ========================================================= */
/* Mobile bottom navigation                                  */
/* ========================================================= */

interface MobileBottomNavigationProps {
  pathname: string;
  isAuthenticated: boolean;
  isSeller: boolean;
  becomeSellerHref: string;
}

function MobileBottomNavigation({
  pathname,
  isAuthenticated,
  isSeller,
  becomeSellerHref,
}: MobileBottomNavigationProps) {
  const t = useTranslations("Navbar");

  return (
    <nav
      aria-label="Mobile primary navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid h-16 max-w-md grid-cols-4 px-1">
        <BottomNavItem
          href="/"
          pathname={pathname}
          exact
          icon={<Home className="h-[21px] w-[21px]" />}
          label={t("home")}
        />

        <BottomNavItem
          href="/sellers"
          pathname={pathname}
          icon={<Store className="h-[21px] w-[21px]" />}
          label={t("sellers")}
        />

        {isAuthenticated ? (
          <BottomNavItem
            href="/saved-sellers"
            pathname={pathname}
            icon={<Heart className="h-[21px] w-[21px]" />}
            label={t("saved")}
          />
        ) : (
          <BottomNavItem
            href={becomeSellerHref}
            activePath="/become-seller"
            pathname={pathname}
            icon={<UserPlus className="h-[21px] w-[21px]" />}
            label={t("sell")}
          />
        )}

        {isAuthenticated ? (
          <BottomNavItem
            href={isSeller ? "/seller/dashboard" : "/profile"}
            activePath={isSeller ? "/seller" : "/profile"}
            pathname={pathname}
            icon={
              isSeller ? (
                <LayoutDashboard className="h-[21px] w-[21px]" />
              ) : (
                <UserRound className="h-[21px] w-[21px]" />
              )
            }
            label={isSeller ? t("dashboard") : t("profile")}
          />
        ) : (
          <BottomNavItem
            href="/login"
            pathname={pathname}
            icon={<LogIn className="h-[21px] w-[21px]" />}
            label={t("login")}
          />
        )}
      </div>
    </nav>
  );
}

interface BottomNavItemProps {
  href: string;
  pathname: string;
  icon: ReactNode;
  label: string;
  activePath?: string;
  exact?: boolean;
}
function BottomNavItem({
  href,
  pathname,
  icon,
  label,
  activePath,
  exact = false,
}: BottomNavItemProps) {
  const targetPath = activePath ?? href.split("?")[0];
  const isActive = exact
    ? pathname === targetPath
    : pathname === targetPath || pathname.startsWith(`${targetPath}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`relative flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30 ${
        isActive ? "text-primary" : "text-text-secondary"
      }`}
    >
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute top-0 h-[3px] w-7 rounded-b-full bg-primary"
        />
      )}

      <span
        aria-hidden="true"
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
          isActive ? "bg-primary-light" : ""
        }`}
      >
        {icon}
      </span>

      <span className="max-w-full truncate">{label}</span>
    </Link>
  );
}
