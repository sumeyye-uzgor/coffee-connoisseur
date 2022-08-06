import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import cls from "classnames";
import useSWR from "swr";
import { useContext, useEffect, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../../store/store-context";
// import coffeeStores from "../../data/coffee-stores.json";
import fetchCoffeeStores from "../../lib/coffee-stores";
import { isEmpty, fetcher } from "../../utils";

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
  const [votingCount, setVotingCount] = useState(0);
  const handleCreateCoffeeStore = async (coffeeStore) => {
    console.log({ coffeeStore });
    const { id, name, neighborhood, address, voting, imgUrl } = coffeeStore;
    try {
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          neighborhood: neighborhood[0] || "",
          address: address || "",
          voting: voting || 0,
          imgUrl,
        }),
      });
      const dbCoffeeStore = await response.json();
      console.log({ dbCoffeeStore });
    } catch (error) {
      console.error("Error creating coffee store", error);
    }
  };
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);
  useEffect(() => {
    if (data && data.length > 0) {
      console.log("data from useSWR", data);
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);
  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find(
          (store) => store.id.toString() === id
        );
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
          setVotingCount(coffeeStoreFromContext.voting || votingCount);
        }
      }
    } else {
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore]);

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch("/api/upvoteCoffeeStore", {
        method: "PUt",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const updatedCoffeeStore = await response.json();
      setVotingCount(updatedCoffeeStore.voting);
    } catch (error) {
      console.error("Error updating coffee store", error);
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }
  const { address, neighborhood, name, imgUrl } = coffeeStore;

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
            <p className={styles.text}>{votingCount}</p>
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
