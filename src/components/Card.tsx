import Datetime from "./Datetime";
import type { Frontmatter } from "src/types";

export interface Props {
  href?: string;
  post: Frontmatter;
  secHeading?: boolean;
}

const styles = {
  cardContainer: "my-6",
  titleLink:
    " font-medium text-lg underline-offset-4 decoration-dashed focus-visible:no-underline focus-visible:underline-offset-0 inline-block",
  titleHeading: "font-medium text-lg decoration-dashed hover:underline",
};

export default function Card({ href, post, secHeading = true }: Props) {
  return (
    <li class={styles.cardContainer}>
      <a href={href} class={styles.titleLink} data-swup-preload>
        {secHeading ? (
          <h2 class={styles.titleHeading}>{post.title}</h2>
        ) : (
          <h3 class={styles.titleHeading}>{post.title}</h3>
        )}
      </a>
      <Datetime datetime={post.datetime} />
      <p>{post.description}</p>
    </li>
  );
}
