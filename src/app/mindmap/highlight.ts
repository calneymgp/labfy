"use client";

import { createContext } from "react";

/** Tag sob hover no painel: só macro, ou macro + subtag. */
export type Highlight = { macro: string; subtag?: string } | null;

export const HighlightContext = createContext<Highlight>(null);
