import React from "react";
import styles from "./marel-dpp-widget.module.css";

const MareDppWidget = ({
  img = "",
  isEmpty = false,
}) => {
  if (isEmpty) {
    return (
      <div className={`${styles.marelDppWidget} ${styles.marelDppEmptyState}`}>
        <div className={styles.marelDppWidgetData}>
          <p>Enter a specific processing line to see in marelDpp</p>
          <p>try: Please show me the Salmon Processing Line.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.marelDppWidget}>
      <div className={styles.marelDppWidgetData}>
        <img src={img} alt="Descriptive Alt Text" className={styles.image} />
      </div>
    </div>
  );
};

export default MareDppWidget;
