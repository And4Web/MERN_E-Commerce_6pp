import { BsFillHeartbreakFill } from "react-icons/bs";

function NotFound() {
  return (
    <div className='container' >
      <h1 style={{textAlign: "center"}}>
        404 - Page not found
      </h1>
      <div style={{textAlign: "center", fontSize: "7rem",padding:"1rem"}}>
        <BsFillHeartbreakFill />
      </div>
    </div>
  )
}

export default NotFound