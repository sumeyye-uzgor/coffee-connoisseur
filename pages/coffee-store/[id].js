import { useRouter } from "next/router";
import Link from "next/link";

const Store = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <Link href="/">
        <a>&larr; Back To Home</a>
      </Link>
      <h1>Store: {id}</h1>
    </div>
  );
};
export default Store;
