import { HomeIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Breadcrumbs() {
  const router = useRouter();

  const pathSegments = router.asPath.split("/").filter((segment) => segment);

  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <Link href="/" className="text-gray-400 hover:text-gray-500">
            <HomeIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/");

          return (
            <li key={href}>
              <div className="flex items-center">
                <ChevronRightIcon
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                />
                <Link
                  href={href}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 capitalize"
                >
                  {segment.replace(/-/g, " ")}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
