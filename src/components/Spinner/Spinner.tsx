import styled from "styled-components";

export const Loader = styled.div<{ color?: string; size?: string; speed?: string }>`
  width: ${({ size }) => size ?? "40px"};
  height: ${({ size }) => size ?? "40px"};
  border: ${({ color }) => (color ? `5px solid ${color}` : `5px solid #fff`)};
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: ${({ speed }) =>
    speed ? `rotation ${speed} linear infinite` : "rotation 0.65s linear infinite"};

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const BouncingLoader = styled.div<{ color; size }>`
  display: flex;
  justify-content: center;

  & > div {
    width: ${({ size }) => size ?? "1rem"};
    height: ${({ size }) => size ?? "1rem"};
    margin: 3rem 0.2rem;
    background: ${({ color }) => color ?? "#8385aa"};
    border-radius: 50%;
    animation: bouncing-loader 0.6s infinite alternate;
  }

  & > div:nth-child(2) {
    animation-delay: 0.2s;
  }

  & > div:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes bouncing-loader {
    to {
      opacity: 0.1;
      transform: translate3d(0, -1rem, 0);
    }
  }
`;

export const Spinner = styled.div<{ color; width }>`
  width: ${({ width }) => width ?? "2.5rem"};
  aspect-ratio: 1;
  border-radius: 50%;
  background: ${({ color }) =>
    color
      ? `radial-gradient(farthest-side, ${color} 94%, #0000) top/8px 8px no-repeat, conic-gradient(#0000 30%,  ${color})`
      : `radial-gradient(farthest-side, #c01b1b 94%, #0000) top/8px 8px no-repeat, conic-gradient(#0000 30%, #c01b1b)`};
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
  animation: s3 1s infinite linear;

  @keyframes s3 {
    100% {
      transform: rotate(1turn);
    }
  }
`;

export const LazySpinner = styled.div`
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 8px solid #514b82;
  animation:
    s10-1 0.8s infinite linear alternate,
    s10-2 1.6s infinite linear;

  @keyframes s10-1 {
    0% {
      clip-path: polygon(50% 50%, 0 0, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%);
    }
    12.5% {
      clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%);
    }
    25% {
      clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%);
    }
    50% {
      clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%);
    }
    62.5% {
      clip-path: polygon(50% 50%, 100% 0, 100% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%);
    }
    75% {
      clip-path: polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50% 100%, 0% 100%);
    }
    100% {
      clip-path: polygon(50% 50%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 0% 100%);
    }
  }
  @keyframes s10-2 {
    0% {
      transform: scaleY(1) rotate(0deg);
    }
    49.99% {
      transform: scaleY(1) rotate(135deg);
    }
    50% {
      transform: scaleY(-1) rotate(0deg);
    }
    100% {
      transform: scaleY(-1) rotate(-135deg);
    }
  }
`;

const BufferingContainer = styled.div<{ color: string }>`
  color: "#fff";

  /* inside div */
  position: relative;
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: center;
  margin-left: -32px;

  /* inside window */
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%) translateY(-50%); */

  div {
    transform-origin: 32px 32px;
    animation: fade 1.2s linear infinite;
  }

  div::after {
    content: "";
    display: block;
    position: absolute;
    top: 16px;
    left: 29px;
    width: 3px;
    height: 8px;
    ${({ color }) => (color ? `background-color: ${color}}` : `background-color:red`)};
    border-radius: 20%;
  }

  div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
  }

  div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
  }

  div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
  }

  div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
  }

  div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
  }

  div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
  }

  div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
  }

  div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
  }

  div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
  }

  div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
  }

  div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
  }

  div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: -0s;
  }

  @keyframes fade {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

export const Buffering = ({ color = "red" }: { color?: string }) => (
  <BufferingContainer color={color}>
    {new Array(12).fill(0).map((item) => (
      <div />
    ))}
  </BufferingContainer>
);

export const Gears = styled.div`
  width: 60px;
  height: 40px;
  position: relative;
  display: inline-block;
  --base-color: #263238; /*use your base color*/

  ::before {
    content: "";
    left: 0;
    top: 0;
    position: absolute;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #fff;
    background-image: radial-gradient(
        circle 8px at 18px 18px,
        var(--base-color) 100%,
        transparent 0
      ),
      radial-gradient(circle 4px at 18px 0px, var(--base-color) 100%, transparent 0),
      radial-gradient(circle 4px at 0px 18px, var(--base-color) 100%, transparent 0),
      radial-gradient(circle 4px at 36px 18px, var(--base-color) 100%, transparent 0),
      radial-gradient(circle 4px at 18px 36px, var(--base-color) 100%, transparent 0),
      radial-gradient(circle 4px at 30px 5px, var(--base-color) 100%, transparent 0),
      radial-gradient(circle 4px at 30px 5px, var(--base-color) 100%, transparent 0),
      radial-gradient(circle 4px at 30px 30px, var(--base-color) 100%, transparent 0),
      radial-gradient(circle 4px at 5px 30px, var(--base-color) 100%, transparent 0),
      radial-gradient(circle 4px at 5px 5px, var(--base-color) 100%, transparent 0);
    background-repeat: no-repeat;
    box-sizing: border-box;
    animation: rotationBack 3s linear infinite;
  }
  ::after {
    content: "";
    left: 35px;
    top: 15px;
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #fff;
    background-image: radial-gradient(
        circle 5px at 12px 12px,
        var(--base-color) 100%,
        transparent 0
      ),
      radial-gradient(circle 2.5px at 12px 0px, var(--base-color) 100%, transparent 0),
      radial-gradient(circle 2.5px at 0px 12px, var(--base-color) 100%, transparent 0),
      radial-gradient(circle 2.5px at 24px 12px, var(--base-color) 100%, transparent 0),
      radial-gradient(circle 2.5px at 12px 24px, var(--base-color) 100%, transparent 0),
      radial-gradient(circle 2.5px at 20px 3px, var(--base-color) 100%, transparent 0),
      radial-gradient(circle 2.5px at 20px 3px, var(--base-color) 100%, transparent 0),
      radial-gradient(circle 2.5px at 20px 20px, var(--base-color) 100%, transparent 0),
      radial-gradient(circle 2.5px at 3px 20px, var(--base-color) 100%, transparent 0),
      radial-gradient(circle 2.5px at 3px 3px, var(--base-color) 100%, transparent 0);
    background-repeat: no-repeat;
    box-sizing: border-box;
    animation: rotationBack 4s linear infinite reverse;
  }
  @keyframes rotationBack {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
`;

export const ProgressLoader = styled.div<{ progress: any }>`
  display: block;
  position: relative;
  height: 32px;
  width: 100%;
  background: #fff;
  border: 1px solid #a0a0a26a;
  color: white;
  overflow: hidden;
  border-radius: 1em;
  font-family: "Poppins300";

  ::before {
    content: "";
    background: #cd171f;
    position: absolute;
    left: 0;
    top: 0;
    width: ${({ progress }) => (progress > 0 ? `${progress}%` : 0)};
    height: 100%;
    transition: width 1.5s linear;
  }

  :after {
    content: ${({ progress }) => (progress > 0 ? `"${progress}%"` : "'0%'")};
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: 1.3em;
    line-height: 32px;
    color: #ebf5ee;
    text-shadow: 0 -1px rgb(0 0 0 / 100%);
    /* mix-blend-mode: difference; */
    background-color: #9895941d;
  }
`;
