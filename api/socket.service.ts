import io, { Socket } from "socket.io-client";
import { BASE_URL } from "@env";

class socketService {
  private socket: Socket | null = null;

  connect(token: string) {
    console.log("Kết nối socket", token);
    if (!this.socket) {
      this.socket = io(`${BASE_URL}/games`, {
        transports: ["websocket"],
        auth: {
          token,
        },
      });

      this.socket.on("connect", () => {
        console.log("Kết nối thành công");
      });

      this.socket.on("connect_error", (err) => {
        console.error("Lỗi kết nối:", err);
      });

      this.socket.on("disconnect", () => {
        console.log("Đã ngắt kết nối");
        this.socket = null;
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.warn("Socket chưa được kết nối emit!");
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.warn("Socket chưa được kết nối on!");
    }
  }

  isConnect() {
    return this.socket?.connected;
  }
}

const socketManager = new socketService();
export default socketManager;
