import React, {useState} from "react";
import socket from "../socket";
import axios from "axios";

function JoinBlock({onLogin}) {
    const [roomId, setRoomId] = useState("")
    const [userName, setUserName] = useState("")
    const [loading, setLoading] = useState(false)

    const onEnter = async () => {
        if(!roomId, !userName){
            return alert("неверные данные")
        }
        const obj = {
            roomId,
            userName
        }
        setLoading(true)
        await axios.post("/rooms", obj )
        onLogin(obj)
    }
  return (
    <>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          id="exampleInputEmail1"
          placeholder="Room ID"
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          id="exampleInputPassword1"
          placeholder="Ваше Имя"
          value={userName}
          onChange={e => setUserName(e.target.value)}
        />
      </div>
      <button disabled={loading} type="submit" className="btn btn-primary" onClick={onEnter}>
          {loading ? "Вход..." : "ВОЙТИ"}
      </button>
    </>
  );
}

export default JoinBlock;
