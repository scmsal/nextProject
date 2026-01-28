import { Link } from "@heroui/react";
export default function Links() {
  return (
    <div>
      <h3>Helpful Links</h3>
      <ul className="text-lg ps-4 pt-4">
        <li>
          <strong> Airbnb:</strong>{" "}
          <Link
            href="https://www.airbnb.com/help/article/2319"
            className="text-lg"
          >
            {`Occupancy tax collection and remittance by
            Airbnb in New York`}
          </Link>
        </li>
        <li>
          <strong>BNBCalc:</strong>{" "}
          <Link
            href="https://www.bnbcalc.com/blog/str-tax/airbnb-vrbo-str-new-york-tax"
            className="text-lg"
          >
            {`The Complete New York Airbnb Host Lodging Tax Guide`}
          </Link>
        </li>
      </ul>
    </div>
  );
}
