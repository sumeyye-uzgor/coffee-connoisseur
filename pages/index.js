import { ACTION_TYPES, StoreContext } from "../store/store-context";
import { useContext, useEffect, useState } from "react";
import Banner from "../components/banner";
import Card from "../components/card";
import Head from "next/head";
import Image from "next/image";
import fetchCoffeeStores from "../lib/coffee-stores";
import styles from "../styles/Home.module.css";
import useTrackLocation from "../hooks/use-track-location";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores,
    }, // will be passed to the page component as props
  };
}
export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;
  useEffect(() => {
    if (latLong) {
      try {
        const fetchData = async () => {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`
          );
          const coffeeStores = await response.json();
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores,
            },
          });
        };
        fetchData();
      } catch (error) {
        setCoffeeStoresError(error.message);
      }
    }
  }, [latLong]);
  const handleOnBannerButtonClick = () => {
    handleTrackLocation();
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta
          name="description"
          content="allows you to discover coffee stores"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleOnBannerButtonClick}
        />
        {locationErrorMsg && <p>Something went wrong... {locationErrorMsg}</p>}
        {coffeeStoresError && (
          <p>Something went wrong... {coffeeStoresError}</p>
        )}

        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            alt="hero image"
            width={700}
            height={400}
          />
        </div>
        <div className={styles.sectionWrapper}>
          {coffeeStores?.length > 0 && (
            <>
              <h2 className={styles.heading2}>Stores near me</h2>
              <div className={styles.cardLayout}>
                {coffeeStores.map((coffeeStore) => (
                  <Card
                    key={coffeeStore.id}
                    imgUrl={
                      coffeeStore?.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    name={coffeeStore.name}
                    id={coffeeStore.id}
                    className={styles.card}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className={styles.sectionWrapper}>
          {props.coffeeStores?.length > 0 ? (
            <>
              <h2 className={styles.heading2}>Istanbul Coffee Stores</h2>
              <div className={styles.cardLayout}>
                {props.coffeeStores.map((coffeeStore) => (
                  <Card
                    key={coffeeStore.id}
                    imgUrl={
                      coffeeStore?.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    name={coffeeStore.name}
                    id={coffeeStore.id}
                    className={styles.card}
                  />
                ))}
              </div>
            </>
          ) : (
            <div>No data found</div>
          )}
        </div>
      </main>
    </div>
  );
}
