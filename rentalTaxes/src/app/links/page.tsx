import { Link } from "@heroui/react";
export default function Links() {
  return (
    <div className="flex flex-col space-between">
      <h3 className="underline">Helpful Links</h3>
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
      <p>
        <strong>Disclaimer:</strong> Links to third-party websites are provided
        for convenience only. We do not endorse nor support the content of
        third-party links and are not responsible for the content of a
        third-party website. Tax regulations are subject to change; please
        verify all information with the official source or a tax professional
        before filing.
      </p>
    </div>
  );
}
