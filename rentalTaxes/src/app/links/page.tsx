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
            target="_blank"
            rel="noopener noreferrer"
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
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg"
          >
            {`The Complete New York Airbnb Host Lodging Tax Guide`}
          </Link>
        </li>
        <li>
          <strong>NY State:</strong>{" "}
          <Link
            href="https://www.tax.ny.gov/pubs_and_bulls/publications/sales/short-term-rental.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg"
          >
            Sales tax on short-term rental unit occupancy
          </Link>
        </li>
      </ul>
    </div>
  );
}
