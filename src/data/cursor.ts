import { getStore } from "@netlify/blobs";

const getCursor = async () => {
  const store = getStore("afterCursor");
  const cursor = await store.get("cursor");
  return cursor
};

const setCursor = async (cursor) => {
  const store = getStore("afterCursor");
  await store.set("cursor", cursor);
};

export { getCursor, setCursor };
