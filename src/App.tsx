import { Suspense } from "react";
import { ConnectedProps, connect } from "react-redux";
import { Loader } from "src/components/Spinner/Spinner";
import AppRoutes from "src/routes";
import { fetchMe, setSidebar } from "src/store/redux/app/actions";
import { AppState } from "src/store/redux/reducer";

function App({ me }: PropsFromRedux) {
  return (
    <Suspense fallback={<Loader />}>
      <AppRoutes />
    </Suspense>
  );
}

const mapStateToProps = ({ appState: { me, isLoading } }: AppState) => ({
  me,
  isLoading,
});

const mapDispatchToProps = { fetchMe, setSidebar };
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)
//   console.log(import.meta.env.VITE_NAME);
//   console.log('name is', process.env.VITE_NAME)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
