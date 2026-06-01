import { create } from "zustand";

interface UIState {
  isMobileMenuOpen: boolean;
  isCartDrawerOpen: boolean;
  isSearchOpen: boolean;
  isChatbotOpen: boolean;
  isNewsletterVisible: boolean;
  isFiltersOpen: boolean;
  theme: "light" | "dark" | "system";
  activeModal: string | null;

  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openMobileMenu: () => void;

  toggleCartDrawer: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;

  toggleSearch: () => void;
  openSearch: () => void;
  closeSearch: () => void;

  toggleChatbot: () => void;
  openChatbot: () => void;
  closeChatbot: () => void;

  toggleNewsletter: () => void;
  openNewsletter: () => void;
  closeNewsletter: () => void;

  toggleFilters: () => void;
  openFilters: () => void;
  closeFilters: () => void;

  setTheme: (theme: "light" | "dark" | "system") => void;

  openModal: (modalName: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isMobileMenuOpen: false,
  isCartDrawerOpen: false,
  isSearchOpen: false,
  isChatbotOpen: false,
  isNewsletterVisible: true,
  isFiltersOpen: false,
  theme: "light",
  activeModal: null,

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),

  toggleCartDrawer: () =>
    set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),

  toggleSearch: () =>
    set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  toggleChatbot: () =>
    set((state) => ({ isChatbotOpen: !state.isChatbotOpen })),
  openChatbot: () => set({ isChatbotOpen: true }),
  closeChatbot: () => set({ isChatbotOpen: false }),

  toggleNewsletter: () =>
    set((state) => ({ isNewsletterVisible: !state.isNewsletterVisible })),
  openNewsletter: () => set({ isNewsletterVisible: true }),
  closeNewsletter: () => set({ isNewsletterVisible: false }),

  toggleFilters: () =>
    set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
  openFilters: () => set({ isFiltersOpen: true }),
  closeFilters: () => set({ isFiltersOpen: false }),

  setTheme: (theme) => set({ theme }),

  openModal: (modalName) => set({ activeModal: modalName }),
  closeModal: () => set({ activeModal: null }),
}));
