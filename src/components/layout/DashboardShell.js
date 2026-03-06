"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HouseIcon,
  UsersIcon,
  BuildingsIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";
import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants";
import styles from "./DashboardShell.module.css";

const NAV_ITEMS = [
  { label: "Översikt", href: "/dashboard", Icon: HouseIcon },
  { label: "Anställda", href: "/dashboard/employees", Icon: UsersIcon },
  { label: "Byggnader", href: "/dashboard/buildings", Icon: BuildingsIcon },
];

function getInitials(email) {
  return email ? email[0].toUpperCase() : "?";
}

export default function DashboardShell({ children, userEmail }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={styles.shell}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={closeSidebar}
          role="presentation"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
        aria-label="Navigering"
      >
        <div className={styles.sidebarLogo}>
          <AppText as="span" size="body" weight="semiBold" color={COLORS.primary}>
            StädAppen
          </AppText>
        </div>

        <nav className={styles.nav} aria-label="Huvudnavigation">
          {NAV_ITEMS.map(({ label, href, Icon }) => {
            const isActive = pathname === href;
            const iconColor = isActive ? COLORS.primary : COLORS.sidebarText;
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                onClick={closeSidebar}
              >
                <Icon size={18} color={iconColor} weight={isActive ? "bold" : "regular"} />
                <AppText
                  as="span"
                  size="body"
                  weight={isActive ? "semiBold" : "regular"}
                  color={COLORS.sidebarText}
                >
                  {label}
                </AppText>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <AppText as="span" size="small" weight="semiBold" color={COLORS.sidebarText}>
                {getInitials(userEmail)}
              </AppText>
            </div>
            <AppText
              as="span"
              size="small"
              color={COLORS.sidebarTextMuted}
              numberOfLines={1}
              style={{ flex: 1, minWidth: 0 }}
            >
              {userEmail}
            </AppText>
          </div>

          <button
            className={styles.logoutLink}
            onClick={handleLogout}
            aria-label="Logga ut"
          >
            <SignOutIcon size={18} color={COLORS.sidebarTextMuted} />
            <AppText as="span" size="body" color={COLORS.sidebarTextMuted}>
              Logga ut
            </AppText>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        {/* Mobile-only topbar with hamburger */}
        <div className={styles.mobileTopbar}>
          <button
            className={styles.hamburger}
            onClick={() => setSidebarOpen(true)}
            aria-label="Öppna meny"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
          <AppText as="span" size="body" weight="semiBold" color={COLORS.primary}>
            StädAppen
          </AppText>
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
