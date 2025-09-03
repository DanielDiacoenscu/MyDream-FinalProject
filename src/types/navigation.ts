// src/types/navigation.ts

export interface MegaMenuImage {
  url: string;
  alt: string;
}

export interface MegaMenuLink {
  id: number;
  label: string;
  href: string;
}

export interface MegaMenuColumn {
  id: number;
  title: string;
  links: MegaMenuLink[];
}

export interface MegaMenuItem {
  id: number;
  columns: MegaMenuColumn[];
  image: MegaMenuImage;
  image_title: string;
  image_href: string;
}

export interface NavigationLink {
  id: number;
  label: string;
  href: string;
  mega_menu: MegaMenuItem | null;
}
