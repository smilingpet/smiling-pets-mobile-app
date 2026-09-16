"use client";

import { Component, type ReactNode } from "react";
import { ErrorState } from "@/components/ui/EmptyState";

type Props = {
  children: ReactNode;
  /** Shown above the retry button, to say what section failed. */
  label?: string;
};

type State = {
  error: Error | null;
};

/**
 * Catches rendering errors from its children and shows a local, detailed
 * error message instead of taking down the whole page.
 *
 * This exists because of a real gap: wrapping a Server Component's data
 * fetch in try/catch (see src/app/collections/[handle]/page.tsx) only
 * catches errors thrown while *fetching* data — it does NOT catch errors
 * thrown later while React actually renders child Client Components (like
 * ProductGrid/ProductCard) built from that data. Those happen in a
 * separate pass, after the page's own function has already returned, so
 * no try/catch in the page component can see them. A React error boundary
 * (which only works as a class component — this is a React API
 * requirement, not a stylistic choice) is the correct, supported way to
 * catch that category of error.
 *
 * Bonus: because this runs entirely in the browser, the error message
 * here is NEVER subject to Next.js's production redaction of Server
 * Component error messages — this always shows the real reason.
 */
export class RenderErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("[RenderErrorBoundary]", this.props.label, error);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorState
          title="Couldn't display this section"
          description={`${this.props.label ? `${this.props.label}: ` : ""}${this.state.error.message}`}
          onRetry={() => this.setState({ error: null })}
        />
      );
    }
    return this.props.children;
  }
}
