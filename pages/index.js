import { useRouter} from 'next/router'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import { store } from 'react-notifications-component';
const url_create = process.env.NEXT_PUBLIC_HOST_URL + "api/addReceiver";

export default function Home() {
    const [drinkNo, setDrinkNo] = useState();
    const [isDrinkNull, setIsDrinkNull] = useState(false);
    const router = useRouter();

    function addSuccessNotification() {
      store.addNotification({
        title: "Sukces!",
        message: "Twój darmowy drink został odebrany.",
        type: "success",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 10000,
          showIcon: true,
        }
      });
    }

    function addWarningNotofication() {
      store.addNotification({
        title: "Uwaga!",
        message: "Wykorzystałeś wszystkie darmowe drinki.",
        type: "danger",
        container: "bottom-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 10000,
          showIcon: true,
        }
      });
    }

    useEffect(() => {
      const newUser = {
        wallet_addres: router.query.wallet
      };

      axios.post(url_create, newUser)
        .then(function (response) {
        console.log("odpowiedz:", response.data[0].quantity);
        setDrinkNo(response.data[0].quantity - 1);
        if (response.data[0].quantity == 0) {
          setIsDrinkNull(true);
          console.log("isDrinkNull w ifie", isDrinkNull);
          setDrinkNo(response.data[0].quantity);
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      //isDrinkNull ? addWarningNotofication() : addSuccessNotification();
      console.log("isDrinkNull", isDrinkNull);
    }, [router.query.wallet]);
    
    function drawDrinks() {
      let drinkiHtml = '';
      for(let i = 0; i < drinkNo; i++){
        const fileName = '/drink' + getRandomInt(1,5) + ".png";
        drinkiHtml += `<img className="drink" src=${fileName} alt="drink" width="250" height="250" style="padding: 5px"></img>`;
      }
      return drinkiHtml;
    }

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
    return (
        <div className="container">
            <Head>
              <title>Rozdajemy drinki!</title>
              <link rel="icon" href="/nfc4.svg" />
            </Head>
            <div className="text1">Użytkownikowi o portfelu:</div>
            <div className="wallet"><span>{router.query.wallet}</span></div>
            <div className="text2">pozostała następująca liczba drinków: <span>{drinkNo}</span></div>
            <div className="drinki" dangerouslySetInnerHTML={{__html: drawDrinks()}}></div>
        <style jsx>{`
            .container {
                min-height: 100vh;
                background-color: #28313B;
                color: rgba(243, 182, 31, 1);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
              .text1, .text2, .wallet {
                font-size: 1.5rem;
              }
              .drinki {
                width: 75%;
                margin: 20px;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
              }
              img {
                padding: 5px;
              }
              .drinki > div {
                margin: 6px;
              }
              .drink {
                width: 100px;
                height: 100px;
              }
              span {
                color: rgba(243, 132, 31, 1);
              }
              .wallet {
                padding: 5px;
              }
              .text1 {
                margin-top: 30px;
              }
              @media only screen and (max-width: 499px) {
                .text1, .text2, .wallet {
                  font-size: 1.2rem;
                }
              }
        `}</style>
        </div>
    )
}
