interface DateFilterFormProps {
  fromDate: string;
  toDate: string;
  setFrom: (val: string) => void;
  setTo: (val: string) => void;
  setFromInclusive: (val: string) => void; //REMOVE
  setToExclNxtMth: (val: string) => void;
}

export default function DateFilterForm({
  fromDate,
  toDate,
  setFrom,
  setTo,
  setFromInclusive,
  setToExclNxtMth: setToExclusive,
}: DateFilterFormProps) {
  // TO DO: make the id unique for reuse on same page... or not necessary if Transactions moved to another page, not on same page as aggregates. It would be helpful to have them on the same page though for reference and cross checking
  return (
    <div className="mb-4 ml-2">
      <label htmlFor="startFilter">
        From
        <input
          type="date"
          id="startFilter"
          name="startFilter"
          className="ml-2 border border-solid border-gray-200"
          value={fromDate}
          onChange={(e) => {
            setFrom(e.target.value); //this is what will appear in the input
            setFromInclusive(e.target.value);
          }}
        />
      </label>
      <label htmlFor="endFilter" className="ml-4">
        To
        <input
          type="date"
          id="endFilter"
          name="endFilter"
          className="ml-2 border border-solid border-gray-200"
          value={toDate}
          onChange={(e) => {
            setTo(e.target.value); //this is what will appear in the input form
            //setToExclNxtMth ?
          }}
        />
      </label>
    </div>
  );
}
