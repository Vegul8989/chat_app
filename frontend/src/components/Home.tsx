import { Link } from "react-router-dom";
import Header from "./Header";

function Home() {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
        <div className="backdrop-blur-sm flex flex-col flex-1">
          <Header />
          <div className="flex flex-col items-center justify-center flex-1 gap-10 text-black">
            <p className="text-5xl">Chat</p>
            <p className="text-3xl">This app is a prototype.</p>
            <Link to="/chat" className="{'btn'} border-2 w-3xs h-xl border-black text-3xl flex justify-center items-center hover:text-blue-300 transition-colors duration-300">
              Start
            </Link>
          </div>
        </div>
    </div>
  );
}
export default Home;