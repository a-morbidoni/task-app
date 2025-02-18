import {
    BarcodeScanningResult,
    CameraView,
    useCameraPermissions
} from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "./context/ThemeContext";
import { addTaskSet } from "./settings";
import { TaskSet } from "./types";

export default function ScanQR() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.text, { color: theme.text }]}>
          Cargando permisos de cámara...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.text, { color: theme.text }]}>
          Necesitamos tu permiso para usar la cámara
        </Text>
        <Button onPress={requestPermission} title="Otorgar permiso" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (!scanning) return;
    setScanned(true);
    setScanning(false);

    try {
      const qrData = JSON.parse(data);

      if (Array.isArray(qrData)) {
        let addedSets = 0;
        for (const taskSet of qrData) {
          if (taskSet.name && Array.isArray(taskSet.tasks)) {
            const newTaskSet: TaskSet = {
              ...taskSet,
              id: `${Date.now()}-${addedSets}`,
            };
            await addTaskSet(newTaskSet);
            addedSets++;
          }
        }
        if (addedSets > 0) {
          router.replace("/");
        }
      }
    } catch (error) {
      console.error("Error al procesar el código QR:", error);
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={[styles.cornerTL, { borderColor: theme.primary }]} />
              <View style={[styles.cornerTR, { borderColor: theme.primary }]} />
              <View style={[styles.cornerBL, { borderColor: theme.primary }]} />
              <View style={[styles.cornerBR, { borderColor: theme.primary }]} />
            </View>
          </View>
        </CameraView>
      </View>

      <View style={styles.controls}>
        {!scanning && !scanned && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={() => setScanning(true)}
          >
            <Text style={[styles.buttonText, { color: theme.surface }]}>
              Comenzar escaneo
            </Text>
          </TouchableOpacity>
        )}

        {scanned && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={() => {
              setScanned(false);
              setScanning(true);
            }}
          >
            <Text style={[styles.buttonText, { color: theme.surface }]}>
              Escanear otro código
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  cameraContainer: {
    width: "100%",
    height: "70%",
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    backgroundColor: "transparent",
    position: "relative",
  },
  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    width: 40,
    height: 40,
  },
  cornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRightWidth: 3,
    borderTopWidth: 3,
    width: 40,
    height: 40,
  },
  cornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    width: 40,
    height: 40,
  },
  cornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    width: 40,
    height: 40,
  },
  controls: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  text: {
    fontSize: 16,
    margin: 20,
    textAlign: "center",
  },
});
