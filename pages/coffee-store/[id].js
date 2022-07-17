import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

import coffeeStores from "../../data/coffee-stores.json";

export function getStaticProps({ params }) {
  return {
    props: {
      coffeeStore: coffeeStores.find(
        (store) => store.id.toString() === params.id
      ),
    },
  };
}
export function getStaticPaths() {
  return {
    paths: coffeeStores.map((store) => ({ params: { id: `${store.id}` } })),
    fallback: true,
  };
}
const Store = (props) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  const { address, name, neighbourhood } = props.coffeeStore;

  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
      <Link href="/">
        <a>&larr; Back To Home</a>
      </Link>
      <p>{address}</p>
      <p>{name}</p>
      <p>{neighbourhood}</p>
    </div>
  );
};
export default Store;
