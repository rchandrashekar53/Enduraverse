import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'auth_service.dart';
import 'auth_screen.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'session_data_screen.dart';
import 'bluetooth_scan_modal.dart'; // Import BLE scanner modal

class DashboardScreen extends StatefulWidget {
  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final AuthService _authService = AuthService();
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  @override
  void initState() {
    super.initState();
    _requestBluetoothPermissions(); // Ensure permissions on startup
  }

  // Request necessary Bluetooth & Nearby Devices permissions
  Future<void> _requestBluetoothPermissions() async {
    Map<Permission, PermissionStatus> statuses = await [
      Permission.bluetooth,
      Permission.bluetoothScan,
      Permission.bluetoothConnect,
      Permission.bluetoothAdvertise,
      Permission.locationWhenInUse, // Required for BLE scanning
    ].request();

    statuses.forEach((permission, status) {
      debugPrint("🔹 $permission: $status");
    });

    if (statuses[Permission.bluetoothScan]?.isDenied ?? true) {
      debugPrint("⚠️ Bluetooth Scan permission denied");
    }
    if (statuses[Permission.bluetoothConnect]?.isDenied ?? true) {
      debugPrint("⚠️ Bluetooth Connect permission denied");
    }
    if (statuses[Permission.bluetoothAdvertise]?.isDenied ?? true) {
      debugPrint("⚠️ Bluetooth Advertise permission denied");
    }
    if (statuses[Permission.locationWhenInUse]?.isDenied ?? true) {
      debugPrint("⚠️ Location permission denied");
    }
  }

  // Add a new session to Firestore
  Future<void> _addSession() async {
    User? user = _auth.currentUser;
    if (user != null) {
      try {
        DocumentReference sessionRef = await _firestore
            .collection("users")
            .doc(user.uid)
            .collection("sessions")
            .add({
          "created_at": FieldValue.serverTimestamp(),
        });

        // Sample Session Data
        await sessionRef.collection("session_data").add({
          "accel_x": 0.54,
          "accel_y": -9.89,
          "accel_z": 3.02,
          "gyro_x": -0.06,
          "gyro_y": -0.03,
          "gyro_z": -0.02,
          "mpu_temp": 28.11,
          "pitch": -72.77,
          "roll": -3.01,
          "yaw": -3.51,
          "vel_x": 1.66,
          "vel_y": -30.81,
          "vel_z": 9.42,
          "disp_x": 3.99,
          "disp_y": -74.56,
          "disp_z": 22.80,
          "jerk_x": 0.02,
          "jerk_y": -0.02,
          "jerk_z": -0.00,
          "speedbreaker": 0,
        });

        debugPrint("✅ New session created successfully!");
      } catch (e) {
        debugPrint("⚠️ Failed to create session: $e");
      }
    }
  }

  // Open Bluetooth Scan Modal after ensuring permissions
  Future<void> _openBluetoothModal() async {
    await _requestBluetoothPermissions(); // Request permissions before scanning
    showScanModal(context);
  }

  @override
  Widget build(BuildContext context) {
    User? user = _auth.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Dashboard"),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await _authService.signOut();
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => AuthScreen()),
              );
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const Text(
              "Your Sessions",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),

            // Buttons Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: _addSession,
                  child: const Text("Create New Session"),
                ),
                ElevatedButton(
                  onPressed: _openBluetoothModal, // Opens Bluetooth scanner with permissions check
                  child: const Text("Connect"),
                ),
              ],
            ),

            const SizedBox(height: 20),

            // Fetch and display user sessions from Firestore
            Expanded(
              child: user == null
                  ? const Center(child: Text("User not logged in"))
                  : StreamBuilder<QuerySnapshot>(
                stream: _firestore
                    .collection("users")
                    .doc(user.uid)
                    .collection("sessions")
                    .orderBy("created_at", descending: true)
                    .snapshots(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                    return const Center(child: Text("No sessions found!"));
                  }

                  var sessions = snapshot.data!.docs;

                  return ListView.builder(
                    itemCount: sessions.length,
                    itemBuilder: (context, index) {
                      var session = sessions[index];
                      return Card(
                        child: ListTile(
                          leading: const Icon(Icons.history),
                          title: Text("Session ${index + 1}"),
                          subtitle: Text(
                            session["created_at"] != null
                                ? session["created_at"].toDate().toString()
                                : "No timestamp",
                          ),
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    SessionDataScreen(user.uid, session.id),
                              ),
                            );
                          },
                        ),
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
