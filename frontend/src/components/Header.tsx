import { Link } from "react-router-dom"

function Header() {
    return (
        <header className="h-15 flex-row justify-between items-center flex px-4">
        <div className="flex items-center gap-2 text-2xl text-black p-4 hover:text-blue-300">
          <span className="i-mdi-check-all w-7 h-7"></span>
          <Link to="/">Chat App</Link>
        </div>
        <div className="pr-7">
          <ul className="flex flex-row gap-10 text-black">
            <li>
              <Link to="/" className="text-lg hover:text-blue-300">Home</Link>
            </li>
            <li>
              <Link to="/chat" className="text-lg hover:text-blue-300">Chat</Link>
            </li>
          </ul>
        </div>
      </header>
    )
}

export default Header