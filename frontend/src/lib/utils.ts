// Shared tiny utilities

/**
 * Simple classNames helper (like clsx / classnames) but zero-dependency.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
