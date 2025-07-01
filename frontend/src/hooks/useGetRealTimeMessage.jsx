import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../Redux/messageSlice";

const useGetRealTimeMessage = () => {
  const { socket } = useSelector((store) => store.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      dispatch(addMessage(newMessage));
    };

    socket.on("newMessage", handleNewMessage);

    // ✅ Clean up to avoid duplicate listeners
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch]);
};

export default useGetRealTimeMessage;
