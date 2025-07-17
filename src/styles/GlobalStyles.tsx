import { createGlobalStyle } from 'styled-components';
import bgImage from '../assets/bg.png';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: url(${bgImage}) no-repeat center center fixed;
    background-size: cover;
    min-height: 100vh;
    color: white;
    position: relative;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    opacity: 0.85;
    z-index: 0;
  }

  #root {
    position: relative;
    z-index: 1;
  }

  /* 添加平滑过渡效果 */
  .fade-enter {
    opacity: 0;
  }
  .fade-enter-active {
    opacity: 1;
    transition: opacity 300ms ease-in;
  }
  .fade-exit {
    opacity: 1;
  }
  .fade-exit-active {
    opacity: 0;
    transition: opacity 300ms ease-in;
  }

  /* 防止Material-UI组件闪烁 */
  .MuiBackdrop-root {
    backdrop-filter: blur(10px);
  }

  /* 确保所有动画平滑 */
  * {
    transition: background-color 0.3s ease,
                transform 0.3s ease,
                opacity 0.3s ease;
  }
`;

export default GlobalStyles; 