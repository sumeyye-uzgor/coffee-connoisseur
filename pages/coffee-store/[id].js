import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import cls from "classnames";
import { useContext, useEffect, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../../pages/_app";
// import coffeeStores from "../../data/coffee-stores.json";
import fetchCoffeeStores from "../../lib/coffee-stores";
import { isEmpty } from "../../utils";

import styles from "../../styles/coffee-store.module.css";

export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find(
    (store) => store.id.toString() === params.id
  );
  return {
    props: {
      coffeeStore: findCoffeeStoreById || {},
    },
  };
}
export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  return {
    paths: coffeeStores.map((store) => ({ params: { id: `${store.id}` } })),
    fallback: true,
  };
}
const Store = (initialProps) => {
  const router = useRouter();
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);
  const { id } = router.query;
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find(
          (store) => store.id.toString() === id
        );
        setCoffeeStore(findCoffeeStoreById);
      }
    }
  }, [id]);
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  const { address, neighborhood, name, imgUrl } = coffeeStore;
  const rate = 3;

  const handleUpvoteButton = () => {
    console.log("upvoted");
  };
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>&larr; Back To Home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            alt={name}
            width={600}
            height={360}
            className={styles.storeImage}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                alt="places icon"
                width={24}
                height={24}
                className={styles.icon}
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                alt="near me icon"
                width={24}
                height={24}
                className={styles.icon}
              />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              alt="star icon"
              width={24}
              height={24}
              className={styles.icon}
            />
            <p className={styles.text}>{rate}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};
export default Store;
