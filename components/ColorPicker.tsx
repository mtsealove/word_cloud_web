import { useRef } from 'react';
import styles from '../styles/color.picker.module.scss';

type ColorPicker = {
    color: string;
    setColor: (c: string) => void;
}

const ColorPicker = ({ color, setColor }:ColorPicker) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
        <div className={styles.container}
            style={{ backgroundColor: color }}
             onClick={() => ref.current?.click()}>
            <input type='color'
                   hidden
                   value={color}
                   onChange={(e) => {
                     setColor(e.target.value);
                   }}
                   ref={ref} />
        </div>
  );
};

export default ColorPicker;
