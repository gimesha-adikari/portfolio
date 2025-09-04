import type { MDXComponents } from "mdx/types";

// Customize components available to MDX globally (optional)
const components: MDXComponents = {
  // Example: map <img> to next/image if you want later
};

export function useMDXComponents(): MDXComponents {
  return components;
}
