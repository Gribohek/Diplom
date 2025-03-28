// src/components/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import "../HomePage/HomePage.css"; // Импортируем CSS для стилей
import Header from "../Header/Header";
import ReactPlayer from "react-player";

const Leksik = () => {
  return (
    <div className="homepage">
      <Header />
      <aside className="sidebar">
        <ul className="menu">
          <li>
            <Link to="/section1">Психологическая база речи</Link>
          </li>
          <li>
            <Link to="/section2">Развитие лексической стороны речи</Link>
          </li>
          <li>
            <Link to="/section3">Развитие граматической стороны речи</Link>
          </li>
          <li>
            <Link to="/section4">Развитие связной речи</Link>
          </li>
          <li>
            <Link to="/section5">Обучение грамоте</Link>
          </li>
          <li>
            <Link to="/section6">Звукопроизношение</Link>
          </li>
          <li>
            <Link to="/section7">Мелкая моторика</Link>
          </li>
          <li>
            <Link to="/section8">Игры и игровые упражнения</Link>
          </li>
        </ul>
      </aside>
      <main className="main-content">
        <h1> Развитие лексической стороны речи</h1>
        <p>
          Работа над словом - исходной единицей языка - занимает одно из самых
          важных мест в общей системе работы по развитию речи.
        </p>
        <p>
          Овладение словарным составом родного языка - необходимое условие
          освоения его грамматического строя, развития связной монологической
          речи, воспитания звуковой стороны слова.
        </p>

        <p>
          Работа над словом - это прежде всего работа по осмыслению его
          значения. Ребенка необходимо знакомить с разными значениями одного и
          того же слова, чтобы обеспечить семантически адекватное его
          использование, формирование обобщенного представления о слове.
          Развитое у ребенка умение употреблять слова и словосочетания сообразно
          контексту, речевой ситуации создает предпосылки для свободного и
          гибкого обращения с языковыми средствами при построении высказывания.
        </p>

        <p>
          Конечно, словесные обозначения (наименования предметов) дети усваивают
          в ходе ознакомления с окружающей действительностью - как стихийного,
          так и специально организованного. Однако словарь дошкольников
          нуждается не только в количественном обогащении, но и в качественном
          совершенствовании. Для этого требуется работа по уточнению значения
          слов, обучению семантически адекватному употреблению синонимов,
          антонимов, многозначных слов, развитию умения понимать переносные
          значения.
        </p>

        <p>
          В развитии словаря дошкольников крайне важным является принцип
          объединения слов в тематические группы. Единицы языка связаны друг с
          другом. Совокупность слов, составляющих тематический ряд, образует
          семантическое поле, которое располагается вокруг ядра. Например,
          многозначное слово "игла" в значении "лист хвойного дерева" входит в
          семантическое поле: дерево - ствол - ветви - хвоя - зеленая -
          пушистая, растет - опадает; игла для шитья входит в другое
          семантическое поле: шить - зашивать - вышивать - платье - рубашка -
          узор - острая - тупая и т.д.
        </p>
        <div>
          <ReactPlayer
            url="https://www.youtube.com/watch?v=zn-WjcBSCyA&ab_channel=%D0%9E%D0%9A%2C%D0%9C%D0%90%D0%9C%21-%D0%BC%D1%83%D0%BB%D1%8C%D1%82%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%D1%8B%D0%B4%D0%BB%D1%8F%D1%80%D0%B0%D0%B7%D0%B2%D0%B8%D1%82%D0%B8%D1%8F%D1%80%D0%B5%D1%87%D0%B8"
            width="600px"
          />
        </div>
        <h1>
          Упражнения и игры, направленные на расширение активного и пассивного
          словаря детей
        </h1>
        <p>«Радуга» (что в комнате красного цвета);</p>
        <p>
          «Какой?» (назови, какой это предмет. Например: шапка (какая?) –
          тёплая, вязаная, синяя, маленькая, …);
        </p>
        <p>
          «Волшебный мешочек» (один ребёнок опускает руку в мешочек, нащупывает
          предмет и описывает его, другие дети должны отгадать что это.
          Предметы, помещённые в мешочек, предварительно рассматриваются с
          детьми, описываются их качества);
        </p>
        <p>
          «Что делает?» (назови как можно больше слов-действий (машина – едет,
          мчится, разгоняется, обгоняет…);
        </p>
        <p>«Скажи наоборот» (подбор слов – антонимов);</p>
        <p>
          «Доскажи словечко» (взрослый произносит незаконченное предложение,
          предлагая 3 варианта окончания фразы. (Например: ножи точат, чтобы они
          становились … (тупыми, кривыми, острыми)). Задание можно усложнить, не
          называя вариантов ответа);
        </p>
        <p>
          «Нелепицы» (правильно ли я сказала: шубу носят летом, у кошки родились
          щенки, а у собаки котята);
        </p>
        <p>
          «4-й лишний» (назови, что лишнее: машина, самолёт, бабочка, автобус.
          Почему?);
        </p>
        <p>
          «Найди и отложи» (найди и отложи только посуду (предлагается ряд
          картинок двух или более категорий);
        </p>
        <p>
          «Части предмета» (из каких частей состоит стул: спинка, ножки,
          сиденье);
        </p>
        <p>
          «Для чего?» (Для чего нужен чайник – кипятить воду, тележка –
          перевозить предметы, …).
        </p>
      </main>
    </div>
  );
};

export default Leksik;
