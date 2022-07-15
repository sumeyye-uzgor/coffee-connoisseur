import Image from "next/image";
import Link from "next/link";
import cls from "classnames";

import styles from "./card.module.css";

const Card = ({ name, imgUrl, id }) => {
  return (
    <Link href={`/coffee-store/${id}`}>
      <a className={styles.cardLink}>
        <div className={cls("glass", styles.container)}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{name}</h2>
          </div>
          <div className={styles.cardImageWrapper}>
            <Image
              src={imgUrl}
              alt={`${name} image`}
              width={260}
              height={160}
              className={styles.cardImage}
            />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
