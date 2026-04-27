import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MobileNavHeader } from "./mobile/MobileNavHeader";
import { MobileNavSearch } from "./mobile/MobileNavSearch";
import { MobileNavLinks } from "./mobile/MobileNavLinks";
import { MobileNavUtilities } from "./mobile/MobileNavUtilities";

export function MobileNav({
  isMobileMenuOpen,
  closeMobileMenu,
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  handleSearchKeyDown,
  handleSearchBlur,
  t,
  suggestions,
  showSuggestions,
  handleSuggestionSelect,
  activeSuggestionIndex,
  locale,
  setLocale,
  theme,
  setLightTheme,
  setDarkTheme,
  navigationItems,
  pathname,
  openMobileDropdown,
  toggleMobileDropdown,
  adminState,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMobileMenuOpen || !mounted) return null;

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-white dark:bg-slate-950 lg:hidden overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      <div className="flex flex-col h-full bg-white dark:bg-slate-950">
        <MobileNavHeader onClose={closeMobileMenu} />

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <MobileNavSearch
            query={searchQuery} setQuery={setSearchQuery}
            onSubmit={handleSearchSubmit} onKeyDown={handleSearchKeyDown}
            onBlur={handleSearchBlur} t={t} suggestions={suggestions}
            showSuggestions={showSuggestions} onSelectSuggestion={handleSuggestionSelect}
            activeIndex={activeSuggestionIndex}
          />

          <MobileNavLinks
            navigationItems={navigationItems} pathname={pathname}
            onNavigate={closeMobileMenu}
            openMobileDropdown={openMobileDropdown}
            toggleMobileDropdown={toggleMobileDropdown}
          />
        </div>

        <MobileNavUtilities
          locale={locale} setLocale={setLocale}
          theme={theme} setLightTheme={setLightTheme} setDarkTheme={setDarkTheme}
          adminState={adminState}
        />
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
