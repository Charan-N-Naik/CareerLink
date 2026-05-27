import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from "next/router";

import styles from "../styles/Home.module.css";

import UserLayout from "@/layout/userlauout/MainUserLayout";

export default function Home() {
  const route = useRouter();
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer__left}>
            <p>Connect with Friends without Exaggeration</p>
            <p>A True social media platform, with stories no blufs !</p>

            <div onClick={() => {route.push("/login")}} className={styles.buttonJoin}>
              <p>Join Now</p>
            </div>
          </div>

           
          <div className={styles.mainContainer__right} > 
            <img src="/images/imageCon.png" alt="imagCon" style={{width:"600px"}}/>
          </div>

        </div>
      </div>
    </UserLayout>
  );
}
