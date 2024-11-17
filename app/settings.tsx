import SettingRow from "@/components/SettingRow";
import UserProfile from "@/components/UserProfile";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import { Divider } from "react-native-paper";

export default function Settings() {
  return (
    <GestureHandlerRootView>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.titleText}>Chung</Text>
          <Divider style={styles.divider} />
          <SettingRow
            icon="circle-half-full"
            text="Chủ đề"
            subtitle="Mặc định hệ thống"
          />
          <SettingRow icon="music-note" text="Âm thanh" isToggle />
          <SettingRow
            icon="account-music"
            text="Chỉ có âm thanh khi di chuyển"
            isToggle
          />
          <SettingRow icon="music" text="Âm nhạc" isToggle isVolume />
          <SettingRow
            icon="file-music"
            text="Âm nhạc trong trò chơi"
            isToggle
          />
          <SettingRow
            icon="music-box"
            text="Âm nhạc trong các câu đố"
            isToggle
          />
          <SettingRow icon="vibrate" text="Rung" isToggle />
        </View>

        {/* <View style={styles.container}>
          <Text style={styles.titleText}>Bàn cờ và quân cờ</Text>
          <Divider style={styles.divider} />
        </View> */}

        <View style={styles.container}>
          <Text style={styles.titleText}>Tùy chọn trò chơi</Text>
          <Divider style={styles.divider} />
          <SettingRow
            icon="square-circle"
            text="Hiển thị nước đi hợp pháp"
            isToggle
          />
          <SettingRow
            icon="square-edit-outline"
            text="Làm nổi bật nước đi cuối cùng"
            isToggle
          />
          <SettingRow icon="map-marker" text="Hiển thị tọa độ" isToggle />
          <SettingRow icon="crop-square" text="Chỉ báo kiểm tra vua" isToggle />
          <SettingRow
            icon="dots-circle"
            text="Nước đi đang chờ xử lý"
            isToggle
          />
          <SettingRow
            icon="chess-queen"
            text="Luôn thăng cấp lên nữ hoàng"
            isToggle
          />
          <SettingRow
            icon="book-open-outline"
            text="Hiển thị tên mở"
            isToggle
          />
          <SettingRow
            icon="chat-processing-outline"
            text="Cho phép trò chuyện"
            isToggle
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.titleText}>Hồ sơ người chơi</Text>
          <Divider style={styles.divider} />
          <UserProfile />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 20,
    color: Colors.DARKBLUE,
  },
  divider: {
    marginHorizontal: 20,
  },
});
