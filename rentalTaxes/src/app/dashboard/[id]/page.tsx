//TODO: STUDY THIS, ESPECIALLY THE TS
//TODO: NOTE, THIS IS JUST AN EXAMPLE. NEEDS TO BE ADAPTED TO THIS APP

import { getDB } from "@/lib/db/pglite";

export default async function Page({ params }: { params: { id: string } }) {
  const db = await getDB();
  //TODO: PUT IN PROPER QUERIES
  const result = await db.query(`SELECT * FROM transactions WHERE id=$1`, [
    params.id,
  ]);
  const note = result.rows[0];

  return (
    <main>
      <h1>{note?.title}</h1>
      <p>{note?.content}</p>
    </main>
  );
}
