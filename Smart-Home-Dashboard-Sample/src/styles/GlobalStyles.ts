import { createGlobalStyle } from 'styled-components';
import bgImage from '../assets/bg.png';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', 'Roboto', sans-serif;
    background: url(${bgImage}) no-repeat center center fixed;
    background-size: cover;
    background-attachment: fixed;
    color: #ffffff;
    min-height: 100vh;
    padding: 20px;
    position: relative;
    transition: background-image 0.3s ease;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(26, 31, 37, 0.85) 0%, rgba(44, 52, 64, 0.85) 100%);
      z-index: -1;
    }
  }

  .glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  }

  .card {
    padding: 20px;
    margin: 10px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.2);
    }
  }
`;

export default GlobalStyles; 