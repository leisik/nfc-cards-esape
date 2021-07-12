import { useRouter} from 'next/router'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import { store } from 'react-notifications-component';
import ClipLoader from "react-spinners/ClipLoader";
const url_create = process.env.NEXT_PUBLIC_HOST_URL + "api/addReceiver";

export default function Home() {
    const [drinkNo, setDrinkNo] = useState(); 
    const [isDrinkNull, setIsDrinkNull] = useState(false);
    const [loading, setLoading] = useState(true);
    const [color, setColor] = useState("#f3841f");
    const router = useRouter();

    function addSuccessNotification() { //generates success notofication
      store.addNotification({
        title: "Sukces!",
        message: "Twój darmowy drink został odebrany.",
        type: "success",
        container: "bottom-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 10000,
          showIcon: true,
        }
      });
    }

    function addWarningNotofication() { //genarates error notofication
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
      setTimeout(function(){ setLoading(false) }, 750);
      axios.post(url_create, newUser)
        .then(function (response) {
        console.log("response:", response.data[0].quantity);
        setDrinkNo(response.data[0].quantity - 1);
        if (response.data[0].quantity == 0) {
          setIsDrinkNull(true);
          setDrinkNo(response.data[0].quantity);
          addWarningNotofication();
        }
        if(response.data[0].quantity > 0) {
          addSuccessNotification();
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      
      console.log("isDrinkNull", isDrinkNull);
    }, [router.query.wallet]);
    
    function drawDrinks() { //generates html to render drink images
      let drinksHtml = '';
      for(let i = 0; i < drinkNo; i++){
        const fileName = '/drink' + getRandomInt(1,5) + ".png";
        drinksHtml += `<img className="drink" src=${fileName} alt="drink" width="250" height="250" style="padding: 5px"></img>`;
      }
      return drinksHtml;
    }

    function getRandomInt(min, max) { //generates random number in range of 1-5 to draw random drink image
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }

    return (
        <div className="container">
            <Head>
              <title>Rozdajemy drinki!</title>
              <link rel="icon" href="/nfc5.svg" />
            </Head>
            <ClipLoader color={color} loading={loading} size={75} />
            {loading ? null : 
              <div className="container"> 
                <div className="text1">Użytkownikowi o portfelu:</div>
                <div className="wallet"><span>{router.query.wallet}</span></div>
                <div className="text2">pozostała następująca liczba drinków: <span>{drinkNo}</span></div>
                <div className="drinki" dangerouslySetInnerHTML={{__html: drawDrinks()}}></div>
              </div>
            } 
        <style jsx>{`
            .container {
                min-height: 100vh;
                background-color: #28313B;
                color: rgba(243, 182, 31, 1);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 100%;
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
