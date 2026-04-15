import { useEffect, useMemo, useState } from "react";
import { defaultProducts } from "../data/catalog";
import {
  clearVisitors,
  pushVisitor,
  readProducts,
  readVisitors,
  writeProducts,
} from "../lib/storage";

export function useStoreData() {
  const [products, setProducts] = useState(() => readProducts());
  const [visitors, setVisitors] = useState(() => readVisitors());

  useEffect(() => {
    writeProducts(products);
  }, [products]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === "tf_products") setProducts(readProducts());
      if (event.key === "tf_visitors") setVisitors(readVisitors());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const api = useMemo(
    () => ({
      products,
      visitors,
      setProducts,
      resetProducts: () => setProducts(defaultProducts),
      logEvent: (entry) => {
        pushVisitor(entry);
        setVisitors(readVisitors());
      },
      clearVisitorLog: () => {
        clearVisitors();
        setVisitors([]);
      },
      refreshVisitors: () => setVisitors(readVisitors()),
    }),
    [products, visitors]
  );

  return api;
}
