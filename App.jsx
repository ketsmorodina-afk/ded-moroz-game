import React, { useEffect, useMemo, useState } from "react";

const ITEMS = [
  { id: 1, name: "Подарок", emoji: "🎁", points: 10 },
  { id: 2, name: "Звезда", emoji: "⭐", points: 15 },
  { id: 3, name: "Мандарин", emoji: "🍊", points: 5 },
  { id: 4, name: "Колокольчик", emoji: "🔔", points: 10 },
  { id: 5, name: "Снежинка", emoji: "❄️", points: 5 },
];

const initialObjects = [
  { id: 1, emoji: "🎁", x: 14, y: 25, caught: false, points: 10 },
  { id: 2, emoji: "⭐", x: 34, y: 48, caught: false, points: 15 },
  { id: 3, emoji: "🍊", x: 55, y: 22, caught: false, points: 5 },
  { id: 4, emoji: "🔔", x: 76, y: 43, caught: false, points: 10 },
  { id: 5, emoji: "❄️", x: 88, y: 18, caught: false, points: 5 },
  { id: 6, emoji: "🎁", x: 24, y: 72, caught: false, points: 10 },
  { id: 7, emoji: "⭐", x: 65, y: 75, caught: false, points: 15 },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [objects, setObjects] = useState(initialObjects);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(45);
  const [finished, setFinished] = useState(false);
  const [sound, setSound] = useState(true);

  const caughtCount = objects.filter((item) => item.caught).length;
  const allCaught = caughtCount === objects.length;

  useEffect(() => {
    if (!started || finished) return;
    if (time <= 0 || allCaught) {
      setFinished(true);
      return;
    }
    const timer = window.setTimeout(() => setTime((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [started, finished, time, allCaught]);

  const message = useMemo(() => {
    if (score >= 65) return "Вот это скорость! Все подарки почти сами нашли дорогу в мешок.";
    if (score >= 35) return "Отличная работа! Праздник уже совсем близко.";
    return "Каждый найденный подарок приближает Новый год!";
  }, [score]);

  function collect(id) {
    if (!started || finished) return;
    const target = objects.find((item) => item.id === id);
    if (!target || target.caught) return;
    setObjects((current) => current.map((item) => item.id === id ? { ...item, caught: true } : item));
    setScore((value) => value + target.points);
  }

  function restart() {
    setObjects(initialObjects.map((item) => ({ ...item, caught: false })));
    setScore(0);
    setTime(45);
    setFinished(false);
    setStarted(true);
  }

  return (
    <main className="app-shell">
      <div className="snow snow-one" />
      <div className="snow snow-two" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="На главную">❄️ <span>Зимняя мастерская</span></a>
        <button className="sound-button" onClick={() => setSound((value) => !value)} aria-label="Переключить звук">
          {sound ? "♫ Звук включён" : "♫ Звук выключен"}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">НОВОГОДНЕЕ ПРИКЛЮЧЕНИЕ</div>
        <h1>Приключения<br /><span>Деда Мороза</span></h1>
        <p className="subtitle">В мастерской переполох: подарки рассыпались по заснеженной поляне. Помоги Деду Морозу собрать их до боя курантов!</p>
      </section>

      <section className="game-card" aria-label="Игра Собери подарки">
        <div className="game-heading">
          <div>
            <div className="mini-label">МИССИЯ № 1</div>
            <h2>Собери подарки</h2>
          </div>
          <div className="stats">
            <div className="stat"><span>ОЧКИ</span><strong>{score}</strong></div>
            <div className="stat"><span>ВРЕМЯ</span><strong className={time <= 10 ? "urgent" : ""}>{time}с</strong></div>
            <div className="stat"><span>СОБРАНО</span><strong>{caughtCount}/{objects.length}</strong></div>
          </div>
        </div>

        <div className={`playfield ${!started || finished ? "paused" : ""}`}>
          <div className="moon">🌙</div>
          <div className="mountain mountain-back" />
          <div className="mountain mountain-front" />
          <div className="tree tree-a">🌲</div><div className="tree tree-b">🌲</div><div className="tree tree-c">🌲</div>
          <div className="cabin">🏠</div>
          <div className="santa">🎅</div>
          {objects.map((item) => (
            <button
              key={item.id}
              className={`collectible ${item.caught ? "collected" : ""}`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              onClick={() => collect(item.id)}
              disabled={!started || finished || item.caught}
              aria-label={item.caught ? "Предмет собран" : `Собрать ${item.emoji}`}
            >
              {item.caught ? "✨" : item.emoji}
            </button>
          ))}
          {!started && (
            <div className="overlay">
              <div className="overlay-icon">🛷</div>
              <h3>Готов к спасению праздника?</h3>
              <p>Нажимай на подарки, звёзды и другие находки, чтобы собрать как можно больше очков.</p>
              <button className="primary-button" onClick={() => setStarted(true)}>Начать приключение <span>→</span></button>
            </div>
          )}
          {finished && (
            <div className="overlay">
              <div className="overlay-icon">{allCaught ? "🏆" : "🎄"}</div>
              <h3>{allCaught ? "Все подарки собраны!" : "Время вышло!"}</h3>
              <p>{message}</p>
              <div className="final-score">Твой результат: <b>{score} очков</b></div>
              <button className="primary-button" onClick={restart}>Играть ещё раз <span>↻</span></button>
            </div>
          )}
        </div>

        <div className="game-footer">
          <span>💡 Совет: нажимай на каждый предмет только один раз.</span>
          <span>{started && !finished ? "Вперёд, помощник Деда Мороза!" : "Праздник ждёт своего героя"}</span>
        </div>
      </section>

      <section className="how-to">
        <div className="how-icon">🧤</div>
        <div><h3>Как играть?</h3><p>У тебя есть 45 секунд. Собирай предметы на поляне, зарабатывай очки и постарайся найти всё до окончания времени.</p></div>
      </section>

      <footer>Сделано с зимним настроением <span>✦</span> До Нового года осталось совсем немного!</footer>
    </main>
  );
}
