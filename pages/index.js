import Head from "next/head";
import Image from "next/image";

import Banner from "../components/banner";
import Card from "../components/card";

import styles from "../styles/Home.module.css";

export async function getStaticProps(context) {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.FOURSQUARE_API_KEY,
    },
  };
  const response = await fetch(
    "https://api.foursquare.com/v3/places/search?query=coffee&ll=40.868192%2C29.127591&limit=6",
    options
  );
  const { results } = await response.json();
  console.log(results);
  // .catch((err) => console.error(err));
  return {
    props: {
      coffeeStores: results,
    }, // will be passed to the page component as props
  };
}
export default function Home({ coffeeStores }) {
  const handleOnBannerButtonClick = () => {
    console.log("clikced");
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={"View stores nearby"}
          handleOnClick={handleOnBannerButtonClick}
        />
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            alt="hero image"
            width={700}
            height={400}
          />
        </div>
        {coffeeStores.length > 0 ? (
          <>
            <h2 className={styles.heading2}>Toronto coffee stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => (
                <Card
                  key={coffeeStore.fsq_id}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  name={coffeeStore.name}
                  id={coffeeStore.fsq_id}
                  className={styles.card}
                />
              ))}
            </div>
          </>
        ) : (
          <div>No data fiound</div>
        )}
      </main>
    </div>
  );
}
