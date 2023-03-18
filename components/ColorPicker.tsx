import { useRef, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SketchPicker, ChromePicker } from 'react-color';
import styles from '../styles/color.picker.module.scss';

type ColorPicker = {
    color: string;
    setColor: (c: string) => void;
}

const ColorPicker = ({ color, setColor }:ColorPicker) => {
  const ref = useRef<HTMLInputElement>(null);
  const [localColor, setLocalColor] = useState<string>(color);
  const [visible, setVisible] = useState<boolean>(false);
  return (
        <div>
            <div className={styles.container}
                style={{ backgroundColor: color }}
                 onClick={() => setVisible(true)}>

            </div>
            {visible && (
                <div className={styles.float}>
                    <SketchPicker color={localColor}
                                  onChangeComplete={(e) => {
                                    setLocalColor(e.hex);
                                  }}/>
                    <button className={styles.button}
                            onClick={() => {
                              setColor(localColor);
                              setVisible(false);
                            }}>
                        확인
                    </button>
                </div>
            )}
        </div>
  );
};

export default ColorPicker;
