import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';

class BluetoothDevicePage extends StatefulWidget {
  final BluetoothDevice device;

  BluetoothDevicePage({required this.device});

  @override
  _BluetoothDevicePageState createState() => _BluetoothDevicePageState();
}

class _BluetoothDevicePageState extends State<BluetoothDevicePage> {
  bool isConnected = false;
  List<BluetoothService> _services = [];
  List<Map<String, dynamic>> receivedDataList = []; // Store received JSON data
  BluetoothCharacteristic? _notificationCharacteristic;

  @override
  void initState() {
    super.initState();
    _connectToDevice();
  }

  // Connect to the BLE device
  Future<void> _connectToDevice() async {
    try {
      await widget.device.connect();
      setState(() {
        isConnected = true;
      });
      debugPrint("✅ Connected to ${widget.device.name}");

      _discoverServices(); // Discover services after connecting
    } catch (e) {
      debugPrint("❌ Failed to connect: $e");
    }
  }

  // Disconnect from the BLE device
  Future<void> _disconnectFromDevice() async {
    await widget.device.disconnect();
    setState(() {
      isConnected = false;
      _services.clear();
      receivedDataList.clear();
    });
    debugPrint("🔴 Disconnected from ${widget.device.name}");
  }

  // Discover available services & characteristics
  Future<void> _discoverServices() async {
    List<BluetoothService> services = await widget.device.discoverServices();
    setState(() {
      _services = services;
    });

    // Search for notification characteristic
    for (var service in services) {
      for (var characteristic in service.characteristics) {
        if (characteristic.properties.notify) {
          _notificationCharacteristic = characteristic;
          _subscribeToNotifications(characteristic);
          return;
        }
      }
    }
  }

  // Subscribe to characteristic notifications (Receives data)
  void _subscribeToNotifications(BluetoothCharacteristic characteristic) async {
    try {
      await characteristic.setNotifyValue(true);
      characteristic.value.listen((value) {
        String receivedString = utf8.decode(value); // Convert bytes to UTF-8 string
        debugPrint("🔔 Notification Received: $receivedString");

        try {
          Map<String, dynamic> jsonData = json.decode(receivedString);
          setState(() {
            receivedDataList.insert(0, jsonData); // Add new data at the top
          });
        } catch (e) {
          debugPrint("❌ Error parsing JSON: $e");
        }
      });
    } catch (e) {
      debugPrint("❌ Error subscribing to notifications: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.device.name.isNotEmpty ? widget.device.name : "Unknown Device"),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _discoverServices,
          ),
          IconButton(
            icon: const Icon(Icons.bluetooth_disabled),
            onPressed: _disconnectFromDevice,
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(
              "Device ID: ${widget.device.remoteId.str}",
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),

            isConnected
                ? Expanded(
              child: ListView.builder(
                itemCount: receivedDataList.length,
                itemBuilder: (context, index) {
                  var data = receivedDataList[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 8.0),
                    color: Colors.black87,
                    child: Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _dataRow("📉 Accel X", data["accel_x"]),
                          _dataRow("📉 Accel Y", data["accel_y"]),
                          _dataRow("📉 Accel Z", data["accel_z"]),
                          _dataRow("🔄 Gyro X", data["gyro_x"]),
                          _dataRow("🔄 Gyro Y", data["gyro_y"]),
                          _dataRow("🔄 Gyro Z", data["gyro_z"]),
                          _dataRow("🔥 MPU Temp", data["mpu_temp"]),
                          _dataRow("📌 Is Previous Data", data["isprev"]),
                        ],
                      ),
                    ),
                  );
                },
              ),
            )
                : Center(
              child: ElevatedButton(
                onPressed: _connectToDevice,
                child: const Text("Reconnect"),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Helper function to display data rows
  Widget _dataRow(String label, dynamic value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(color: Colors.white, fontSize: 16),
          ),
          Text(
            value != null ? value.toString() : "N/A",
            style: const TextStyle(color: Colors.greenAccent, fontSize: 16),
          ),
        ],
      ),
    );
  }
}
