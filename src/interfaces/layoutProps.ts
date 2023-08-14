export interface LayoutStoreType {
  menucollapsed: boolean | undefined;
  setMenuCollapse: (menucollapsed: boolean | undefined) => void;
  theme: string;
  changeTheme: (theme: string) => void;
  clearLayoutValues: () => void;
}
