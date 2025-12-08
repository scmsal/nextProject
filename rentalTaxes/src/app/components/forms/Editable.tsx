import { useState } from "react";

interface EditableProps {
  value: string;
  onSubmit: (params: { inputVal: string }) => Promise<void>;
}

export default function Editable({ value, onSubmit }: EditableProps) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(value);

  if (editing) {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit({ inputVal });
          setEditing(false);
        }}
      >
        <input
          className="border px-2"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
          }}
        />
        <button type="submit" className="border ml-2 px-1">
          Submit
        </button>
      </form>
    );
  }
  return <span onClick={() => setEditing(true)}>{value}</span>;
}
