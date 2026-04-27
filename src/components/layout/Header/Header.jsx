"use client";

import React from "react";
import { useHeader } from "@/hooks/useHeader";
import { HeaderSearchForm } from "./HeaderSearchForm";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { HeaderLogo, MobileMenuToggle } from "./HeaderUI";

export default function Header() {
  const h = useHeader();

  return (
    <header className="fixed top-0 left-0 right-0 z-100 w-full bg-white/95 shadow-sm backdrop-blur dark:bg-slate-950/95">
      <div className="w-full px-6 pt-2 sm:px-10 lg:px-16 xl:px-20">
        <div className="flex items-center justify-between py-3">
          <HeaderLogo />

          <div className="mx-6 hidden max-w-sm flex-1 lg:block">
            <HeaderSearchForm
              value={h.searchQuery} onChange={(e) => h.setSearchQuery(e.target.value)}
              onSubmit={h.handleSearchSubmit} onKeyDown={h.handleSearchKeyDown}
              onBlur={h.handleSearchBlur} placeholder={h.t("header.searchPlaceholder")}
              buttonLabel={h.t("common.search")} suggestions={h.suggestions}
              showSuggestions={h.showSuggestions} onSelectSuggestion={h.handleSuggestionSelect}
              listboxId="desktop-search-listbox" activeIndex={h.activeSuggestionIndex}
            />
          </div>

          <MobileMenuToggle isOpen={h.isMobileMenuOpen} onToggle={h.toggleMobileMenu} />
        </div>

        <DesktopNav
          navigationItems={h.navigationItems} pathname={h.pathname}
          openDesktopDropdown={h.openDesktopDropdown} toggleDesktopDropdown={h.toggleDesktopDropdown}
          setOpenDesktopDropdown={h.setOpenDesktopDropdown} locale={h.locale}
          setLocale={h.setLocale} theme={h.theme}
          setLightTheme={h.setLightTheme} setDarkTheme={h.setDarkTheme}
          adminState={h.adminState} desktopDropdownRef={h.desktopDropdownRef}
        />
      </div>

      <MobileNav
        isMobileMenuOpen={h.isMobileMenuOpen} closeMobileMenu={h.closeMobileMenu}
        searchQuery={h.searchQuery} setSearchQuery={h.setSearchQuery}
        handleSearchSubmit={h.handleSearchSubmit} handleSearchKeyDown={h.handleSearchKeyDown}
        handleSearchBlur={h.handleSearchBlur} t={h.t}
        suggestions={h.suggestions} showSuggestions={h.showSuggestions}
        handleSuggestionSelect={h.handleSuggestionSelect} activeSuggestionIndex={h.activeSuggestionIndex}
        locale={h.locale} setLocale={h.setLocale} theme={h.theme}
        setLightTheme={h.setLightTheme} setDarkTheme={h.setDarkTheme}
        navigationItems={h.navigationItems} pathname={h.pathname}
        openMobileDropdown={h.openMobileDropdown} toggleMobileDropdown={h.toggleMobileDropdown}
        adminState={h.adminState}
      />
    </header>
  );
}
