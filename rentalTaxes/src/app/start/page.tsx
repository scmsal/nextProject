import { Button, Card } from "@heroui/react";
import { ArrowRightIcon } from "lucide-react";
import NextLink from "../components/NextLink";
export default function StartPage() {
  return (
    <div className="flex relative items-center h-screen">
      <h3 className="absolute top-4 left-4">Step by Step Guide</h3>
      <div>
        <Card className="max-w-3/5 mx-auto text-lg">
          <p>This wizard will take you step by step through the process of</p>
          <ul className="list-decimal gap-1.5 p-4">
            <li className="mb-2">
              inputting your <strong>properties</strong> {`(houses, buildings)`}{" "}
              and the corresponding <strong>listings</strong> as they appear on
              your booking sites.
            </li>
            <li className="mb-2">
              uploading the <strong>transactions</strong> data.
            </li>
            <li className="mb-2">
              <strong>calculating totals</strong> categorized{" "}
              <strong>
                by property and length of stay {`(short term / long term)`}{" "}
              </strong>
              for any given time range.
            </li>
          </ul>
        </Card>
      </div>
      <div className="absolute bottom-10 right-6 ">
        <NextLink slug={"/properties"} contents="Step 1: Manage properties" />
      </div>
    </div>
  );
}
