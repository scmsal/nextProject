import { Link } from "@heroui/react";
import { CircleArrowRight } from "lucide-react";

interface NextButtonProps {
  slug: string;
  contents: string;
}

export default function NextLink({ slug, contents }: NextButtonProps) {
  return (
    <Link className="p-2">
      <a href={slug} className="flex space-between align-middle">
        {" "}
        <span className="me-2"> Continue </span> <CircleArrowRight size={24} />
      </a>
    </Link>
  );
}
