import { Link } from "@heroui/react";
import { CircleArrowLeft } from "lucide-react";

interface BackLinkProps {
  slug: string;
  contents: string;
}

export default function BackLink({ slug, contents }: BackLinkProps) {
  return (
    <Link className="p-2">
      <a href={slug} className="flex space-between align-middle">
        {" "}
        <CircleArrowLeft size={24} /> <span className="ms-2"> Back </span>
      </a>
    </Link>
  );
}
