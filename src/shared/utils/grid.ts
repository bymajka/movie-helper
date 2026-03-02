// Tailwind breakpoints: sm=640, md=768, lg=1024, xl=1280
// Grid columns per breakpoint: base=2, sm=3, md=4, lg=5, xl=6

/**
 * Returns responsive visibility classes for grid items based on index and max rows.
 * Hides items that exceed the row limit at each breakpoint.
 */
export const getGridItemVisibilityClass = (
  index: number,
  maxRows: number = 2,
): string => {
  const maxAtBase = maxRows * 2;
  const maxAtSm = maxRows * 3;
  const maxAtMd = maxRows * 4;
  const maxAtLg = maxRows * 5;

  const classes: string[] = [];

  if (index >= maxAtBase) classes.push("hidden", "sm:block");
  if (index >= maxAtSm) classes.push("sm:hidden", "md:block");
  if (index >= maxAtMd) classes.push("md:hidden", "lg:block");
  if (index >= maxAtLg) classes.push("lg:hidden", "xl:block");

  return classes.join(" ");
};
