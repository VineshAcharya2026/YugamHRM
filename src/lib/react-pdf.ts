/**
 * React 19 types expect JSX components that @react-pdf/renderer's class-based
 * typings don't satisfy. Re-export primitives as generic function components.
 */
import * as PR from '@react-pdf/renderer';
import type { ComponentType, ReactNode } from 'react';

type AnyProps = Record<string, unknown> & { children?: ReactNode };

const asComp = <T,>(c: T) => c as unknown as ComponentType<AnyProps>;

export const Document = asComp(PR.Document);
export const Page = asComp(PR.Page);
export const View = asComp(PR.View);
export const Text = asComp(PR.Text);
export const PDFDownloadLink = asComp(PR.PDFDownloadLink);
export const PDFViewer = asComp(PR.PDFViewer);
export const StyleSheet = PR.StyleSheet;
export const Font = PR.Font;
