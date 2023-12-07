export const Default_Col_Width = '100';

export const Default_Table_Height = 100;
export const Default_Table_Width = 200;

/** 高亮背景色 */
export const Highlight_Color = {
  light: { from: '#71a2fd', to: '#fff' },
  dark: { from: '#1e4c99', to: '#181c21' },
};
/** 高亮持续时间 */
export const Highlight_Duration = 2000;
/** 高亮变更频率 */
export const Highlight_Color_Change_Freq = 100;

let _chromeVersion = 0;
try {
  const userAgent = navigator.userAgent.match(/chrome\/\d+/i);
  if (userAgent) {
    _chromeVersion = +userAgent[0].split('/')[1];
  }
} catch (e) {
  console.error('Cannot get Chrome version', e);
}
/** 是否兼容低版本模式 */
export const Is_Legacy_Mode = _chromeVersion < 56;
