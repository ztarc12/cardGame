import React from "react";
import { useState, useEffect } from "react";
import cardData from "./cardData";

import "./card.css"
import logo from './logo.svg'

function Card() {
  const [cards, setCards] = useState([]);
  const [flipCards, setFlipCards] = useState([]);
  const [matchCards, setMatchCards] = useState([]);
  const [gameStart, setGameStart] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showCards, setShowCards] = useState(true)

  //카드 섞기
  const suffledCards = () => {
    const shuffleCard = [...cardData, ...cardData] // 2개의 카드를 비교하기 위해 15개 데이터가 있는 cardData 두번 호출
      .sort(()=>Math.random() - 0.5) // 카드 배열 무작위 섞기
      .map(card => ({...card, id: Math.random()})); // 카드 별 id값 부여
    
    setCards(shuffleCard)
  }

  useEffect(() => {
    suffledCards();
    setTimeout(()=>setShowCards(false),2000)
  }, []);

  //카드 클릭 확인
  const cardClick = (id) => {
    if(!gameStart) {
      alert("'시작하기' 버튼을 클릭해주세요.")
      return
    }
    if(flipCards.length < 2 && !flipCards.includes(id) && !matchCards.includes(id)) //카드가 뒤집힌 상태인지, 이미 뒤집힌 카드인지, 이미 맞춘 카드인지 확인
    {
      setFlipCards([...flipCards, id]); // 위 조건을 모두 통과하면 flipCards 배열에 추가
    }
  }
  // 두개의 카드 비교
  useEffect(()=>{
    if(flipCards.length === 2) {
      const [firstCard, secondCard] = flipCards.map(id=>
        cards.find(card=>card.id === id));
      if (firstCard.name === secondCard.name) {
        setMatchCards([...matchCards, firstCard.id, secondCard.id])
      }
      setTimeout(()=>setFlipCards([]),1000);
    }
  }, [flipCards, cards])

  // 타이머 설정
  useEffect(()=>{
    let timer
    if(gameStart && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1)
      }, 1000);
    } else if (timeLeft === 0) {
      alert('실패! 시간 초과')
      setGameStart(false)
    }
    return () => clearInterval(timer)
  }, [gameStart, timeLeft])

  // 시작하기 클릭
  const startGame = () => {
    setGameStart(true)
    setTimeLeft(60)
    setFlipCards([])
    setMatchCards([])
    suffledCards()
    setShowCards(true);
  }
  
  // 초기화 클릭
  const resetGame = () => {
    setGameStart(false)
    setTimeLeft(60)
    setFlipCards([])
    setMatchCards([])
    suffledCards()
    setShowCards(true);
  }

  // 성공 여부 확인
  useEffect(()=>{
    if(matchCards.length === cards.length && matchCards.length) {
      alert('성공! 모든 카드를 맞췄습니다.')
      setGameStart(false)
      resetGame()
    }
  }, [matchCards, cards])

  return (
    <section>
      <div style={{paddingTop:'30px'}}>
        <h2>카드 뒤집기 게임</h2>
        <div className='card-grid'>
          {
            cards.map((card)=>{
              return(
                <CardShuffle key={card.id} card={card} cardClick={cardClick} isFlip={gameStart ? flipCards.includes(card.id) : showCards} isMatch={matchCards.includes(card.id)}/>
              )
            })
          }
        </div>
        <div className="btnBox">
          <button className="startBtn" onClick={()=>{startGame()}}>시작하기</button>
          <button className="resetBtn" onClick={()=>{resetGame()}}>초기화</button>
        </div>
        <div className="timeLeft">
          <img src={process.env.PUBLIC_URL+'/images/timeIcon.svg'}></img>
          <span>{timeLeft}</span>
        </div>
      </div>
    </section>
  )
}

function CardShuffle({card, cardClick, isFlip, isMatch}){
  return(
      <div onClick={()=>{cardClick(card.id)}} className={`card ${isFlip || isMatch ? 'flipped' : ''}`}>
        <div className="card-inner">
          <div className="card-front">
            <img src={logo}></img>
          </div>
          <div className="card-back">
            <img src={card.img} alt={card.name}></img>
          </div>
        </div>
      </div>
  )
}

export default Card