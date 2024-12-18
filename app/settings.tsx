import SettingRow from "@/components/SettingRow";
import UserProfile from "@/components/UserProfile";
import { View, Text, StyleSheet, Switch, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import { Divider } from "react-native-paper";
import BackgroundSetting from "@/components/BackgroundSetting";
import { useDispatch, useSelector } from "react-redux";
import { setSetting } from "@/redux/slices/settingsSlice";
import { selectSettingsState } from "@/redux/selectors/settingsSelectors";

export default function Settings() {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettingsState);

  const handleToggle = async (key: string) => {
    const currentValue = settings[key];
    dispatch(setSetting({ key, value: !currentValue }));
  };

  return (
    <GestureHandlerRootView>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.titleText}>Chung</Text>
          <Divider style={styles.divider} />
          <SettingRow
            icon="music"
            text="Âm nhạc"
            state={settings.isAppSoundPlaying}
            onToggle={() => handleToggle("isAppSoundPlaying")}
          />
          <SettingRow
            icon="music"
            text="Âm thanh khi di chuyển"
            state={settings.isMoveSoundPlaying}
            onToggle={() => handleToggle("isMoveSoundPlaying")}
          />
          {/* <SettingRow
            icon="file-music"
            text="Âm nhạc trong trò chơi"
          />
          <SettingRow
            icon="music-box"
            text="Âm nhạc trong các câu đố"
          /> */}
          {/* <SettingRow
            icon="vibrate"
            text="Rung"
          /> */}
        </View>

        <View style={styles.container}>
          <Text style={styles.titleText}>Bàn cờ và quân cờ</Text>
          <Divider style={styles.divider} />
          <BackgroundSetting />
        </View>

        <View style={styles.container}>
          <Text style={styles.titleText}>Tùy chọn trò chơi</Text>
          <Divider style={styles.divider} />
          <SettingRow
            icon="square-circle"
            text="Hiển thị nước đi hợp pháp"
            state={settings.showLegalMoves}
            onToggle={() => handleToggle("showLegalMoves")}
          />
          {/* <SettingRow
            icon="square-edit-outline"
            text="Làm nổi bật nước đi cuối cùng"
          /> */}
          <SettingRow
            image={require("@/assets/icons/icon-show-coordinates.png")}
            text="Hiển thị tọa độ"
            state={settings.showCoordinates}
            onToggle={() => handleToggle("showCoordinates")}
          />
          {/* <SettingRow
            icon="crop-square"
            text="Chỉ báo kiểm tra vua"
          /> */}
          {/* <SettingRow
            icon="dots-circle"
            text="Nước đi đang chờ xử lý"
          /> */}
          {/* <SettingRow
            icon="chess-queen"
            text="Luôn thăng cấp lên nữ hoàng"
          /> */}
          {/* <SettingRow
            icon="book-open-outline"
            text="Hiển thị tên mở"
          /> */}
          {/* <SettingRow
            icon="chat-processing-outline"
            text="Cho phép trò chuyện"
          /> */}
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
    paddingVertical: 10,
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
