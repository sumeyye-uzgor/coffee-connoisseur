import { useRouter } from "next/router";

const Store = () => {
  const router = useRouter();
  const { id } = router.query;

  return <h1>Store: {id}</h1>;
};
export default Store;
