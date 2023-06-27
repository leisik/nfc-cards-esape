import { useRouter} from 'next/router'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import ClipLoader from "react-spinners/ClipLoader";
const url_create = process.env.NEXT_PUBLIC_HOST_URL + "api/getOneEntry";

export default function Home() {
    const [drinkNo, setDrinkNo] = useState(); 
    const [loading, setLoading] = useState(true);
    const [emptyResponse, setEmptyResponse] = useState(false);
    const [color, setColor] = useState("#f3841f");
    const router = useRouter();

    useEffect(() => {
      const newUser = {
        wallet_addres: router.query.wallet
      };
      axios.post(url_create, newUser)
        .then(function (response) {
          setDrinkNo(response.data.length != 0 ? response.data[0].quantity: 0);
          setLoading(false);
          if(response.data.length == 0) {
            setEmptyResponse(true);
          }
      })
      .catch(function (error) {
        console.log(error);
      })
      
    }, [router.query.wallet]);

    function renderDrinkText(drinkNumber) { //odmiana rzeczownika 
      if (drinkNumber == 1) return "drink";
      else if (drinkNumber == 2 || drinkNumber == 3 || drinkNumber == 4) return "drinki";
      else return "drinków";
    }
    
    function drawDrinks() { //generates html to render drink images
      let drinksHtml = '';
      for(let i = 0; i < drinkNo; i++){
        const fileName = '/drink' + getRandomInt(1,5) + "A.png";
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
            {loading ? null : (
              emptyResponse ? 
              <div className="container"> 
                <div className="text1">Użytkownik o portfelu:</div>
                <div className="wallet"><span>{router.query.wallet}</span></div>
                <div className="text2">Nie istenieje!</div>
              </div>
              :
              (
              drinkNo != 0 ?
              <div className="container"> 
                <div className="text1">Masz jeszcze <span>{drinkNo}</span> {renderDrinkText(drinkNo)} do odebrania!</div>
                <div className="drinki" dangerouslySetInnerHTML={{__html: drawDrinks()}}></div>
              </div> 
              :
              <div className="container"> 
                <div className="text1">Wykorzystałeś wszystkie darmowe drinki.</div>
                <div className="text3">:(</div>
              </div> 
              ))
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
              .text3 {
                font-size: 3rem;
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
                font-weight: 600;
              }
              .wallet {
                padding: 5px;
              }
              .text1 {
                margin-top: 30px;
              }
              @media only screen and (max-width: 499px) {
                .text1, .text2, .wallet {
                  font-size: 1rem;
                }
              }
        `}</style>
        </div>
    )
}
