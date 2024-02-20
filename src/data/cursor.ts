import { getStore } from "@netlify/blobs";

const getCursor = async () => {
  const store = getStore("cursorRecord");
  const cursor = await store.get("cursor");
  return cursor
};

const setCursor = async (cursor) => {
  const store = getStore("cursorRecord");
  await store.set("cursor", cursor);
};

export { getCursor, setCursor };
