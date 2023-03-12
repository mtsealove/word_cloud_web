// eslint-disable-next-line import/no-extraneous-dependencies
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import { useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import styles from '../styles/home.module.scss';
import ColorPicker from '../components/ColorPicker';

const fontList: IFont[] = [
  { name: 'Pretendard', displayName: '프리텐다드' },
  { name: 'GeekbleMalang2', displayName: '긱블말랑이' },
];

export default function Home() {
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [font, setFont] = useState<string>('Pretendard');
  const [words, setWords] = useState<IWord[]>([]);
  const [newWordValue, setNewWordValue] = useState<number>(0);
  const [newWordText, setNewWordText] = useState<string>('');
  const [newWordRotate, setNewWordRotate] = useState<Degree>(0);
  const [fontWeight, setFontWeight] = useState<string>('700');
  const textRef = useRef<HTMLInputElement>(null);
  const MyWordCloud = useMemo(() => (
    dynamic(import('../components/MyWordCloud'), { ssr: false })
  ), [words, backgroundColor, font]);
  // 단어 추가
  const addWord = () => {
    if (newWordText.length === 0) {
      window.alert('단어를 입력하세요');
      return;
    }
    if (newWordValue === 0) {
      window.alert('1 ~ 10의 가중치를 입력하세요');
      return;
    }
    if (words.filter((w) => w.text === newWordText).length !== 0) {
      window.alert('이미 존재하는 단어입니다');
      return;
    }
    let maxId = 0;
    if (words.length === 0) {
      maxId = 0;
    } else {
      // eslint-disable-next-line prefer-destructuring
      maxId = words.map((w) => w.id).sort((a, b) => {
        if (a > b) {
          return -1;
        } if (a < b) {
          return 1;
        }
        return 0;
      })[0];
    }
    const newWord: IWord = {
      id: maxId + 1,
      text: newWordText,
      value: newWordValue,
      rotate: newWordRotate,
    };
    setWords([...words, newWord]);
    setNewWordText('');
    setNewWordValue(0);
    setNewWordRotate(0);
    textRef.current?.focus();
  };
  // 단어 삭제
  const removeWord = (id: number) => {
    setWords(words.filter((w) => w.id !== id));
  };
    // 단어 수정
  const editWord = ({
    id, text, value, rotate,
  }: IWordEdit) => {
    setWords(words.map((w) => {
      if (w.id === id) {
        if (text) {
          w.text = text;
        }
        if (value !== undefined) {
          w.value = value;
        }
        if (rotate !== undefined) {
          w.rotate = rotate;
        }
      }
      return w;
    }));
  };
  const imageRef = useRef<HTMLDivElement>(null);
  const downloadImage = () => {
    if (imageRef.current) {
      html2canvas(imageRef.current)
        .then((res) => {
          const dataurl = res.toDataURL('image/jpg');
          const a = document.createElement('a');
          a.download = '워드클라우드';
          a.href = dataurl;
          a.click();
        });
    }
  };
  return (
    <main className={styles.container}>
        <NextSeo title='해시의 워드클라우드 생성기'/>
        <section className={styles.setup}>
          <article className={styles.card}>
              <h1>워드 클라우드 생성기</h1>
              <label>배경 색 설정</label>
              <ColorPicker color={backgroundColor}
                           setColor={setBackgroundColor} />
              <label>폰트 선택</label>
              <select value={font}
                      className={styles.cardInput}
                      onChange={(e) => {
                        setFont(e.target.value);
                      }}>
                  {fontList.map((f) => (
                      <option value={f.name}
                              key={`font ${f.name}`}>
                          {f.displayName}
                      </option>
                  ))}
                  <option disabled>폰트 추가는 DM으로 부탁드려요 🙏</option>
              </select>
              <label>폰트 두께</label>
              <select value={fontWeight}
                      className={styles.cardInput}
                      onChange={(e) => setFontWeight(e.target.value)}>
                  <option value='100'>Thin</option>
                  <option value='200'>ExtraLight</option>
                  <option value='300'>Light</option>
                  <option value='400'>Regular</option>
                  <option value='500'>Medium</option>
                  <option value='600'>SemiBold</option>
                  <option value='700'>Bold</option>
                  <option value='800'>ExtraBold</option>
                  <option value='900'>Black</option>
              </select>
              <label>단어 목록</label>
              {words.map((word) => (
                  <div key={`word ${word.id}`}
                       className={styles.word}>
                      <input value={word.text}
                             onChange={(e) => {
                               editWord({
                                 id: word.id,
                                 text: e.target.value,
                               });
                             }}
                      />
                      <input value={word.value}
                             max={10}
                             min={1}
                             type='number'
                             onChange={(e) => {
                               editWord({
                                 id: word.id,
                                 value: Number(e.target.value),
                               });
                             }}
                      />
                      <select value={word.rotate}
                              onChange={(e) => {
                                editWord({
                                  id: word.id,
                                  // @ts-ignore
                                  rotate: Number(e.target.value),
                                });
                              }}>
                          <option value={0}>표준</option>
                          <option value={90}>우측 회전</option>
                          <option value={270}>좌측 회전</option>
                          <option value={180}>뒤집기</option>
                      </select>
                      <button onClick={() => removeWord(word.id)}>삭제</button>
                  </div>
              ))}
              <div>
                  <div className={`${styles.word} ${styles.add}`}>
                      <input value={newWordText}
                             ref={textRef}
                             onChange={(e) => setNewWordText(e.target.value)}
                             placeholder='단어 입력' />
                      <input value={newWordValue !== 0 ? newWordValue : ''}
                             type='number'
                             placeholder='가중치 입력(1 ~ 10)'
                             min={1}
                             max={10}
                             onChange={(e) => setNewWordValue(Number(e.target.value))}
                             onKeyDown={(e) => {
                               if (e.key === 'Enter') {
                                 addWord();
                               }
                             }} />
                      <select value={newWordRotate}
                              onChange={(e) => {
                                // @ts-ignore
                                setNewWordRotate(Number(e.target.value));
                              }}>
                          <option value={0}>표준</option>
                          <option value={90}>우측 회전</option>
                          <option value={270}>좌측 회전</option>
                          <option value={180}>뒤집기</option>
                      </select>
                      <button onClick={addWord}>추가</button>
                  </div>
                  <button onClick={downloadImage}
                          className={styles.download}>
                      이미지 다운로드
                  </button>
              </div>
          </article>
        </section>
         <div style={{ backgroundColor }}
              ref={imageRef}>
             <MyWordCloud words={words}
                          font={font}
                          fontWeight={fontWeight} />
         </div>
    </main>
  );
}
