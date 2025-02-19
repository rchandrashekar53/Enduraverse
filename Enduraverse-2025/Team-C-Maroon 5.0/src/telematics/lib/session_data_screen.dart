import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class SessionDataScreen extends StatelessWidget {
  final String userId;
  final String sessionId;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  SessionDataScreen(this.userId, this.sessionId);

  @override
  Widget build(BuildContext context) {
    debugPrint("Fetching session data for user: $userId, session: $sessionId");

    return Scaffold(
      appBar: AppBar(title: Text("Session Data")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(
              "Session ID: $sessionId",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),

            Expanded(
              child: StreamBuilder<QuerySnapshot>(
                stream: _firestore
                    .collection("users")
                    .doc(userId)
                    .collection("sessions")
                    .doc(sessionId)
                    .collection("session_data")
                    .snapshots(),
                builder: (context, snapshot) {
                  debugPrint("Snapshot Connection State: ${snapshot.connectionState}");

                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Center(child: CircularProgressIndicator());
                  }

                  if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                    debugPrint("No session data found!");
                    return Center(child: Text("No session data found!"));
                  }

                  debugPrint("Session data fetched: ${snapshot.data!.docs.length} records");

                  var sessionData = snapshot.data!.docs;

                  return ListView.builder(
                    itemCount: sessionData.length,
                    itemBuilder: (context, index) {
                      var data = sessionData[index];

                      return Card(
                        elevation: 2,
                        margin: EdgeInsets.symmetric(vertical: 5),
                        child: ListTile(
                          leading: Icon(Icons.storage, color: Colors.blue),
                          title: Text("Acceleration: X: ${data["accel_x"]}, Y: ${data["accel_y"]}, Z: ${data["accel_z"]}"),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("Velocity: X: ${data["vel_x"]}, Y: ${data["vel_y"]}, Z: ${data["vel_z"]}"),
                              Text("Displacement: X: ${data["disp_x"]}, Y: ${data["disp_y"]}, Z: ${data["disp_z"]}"),
                              Text("Pitch: ${data["pitch"]}, Roll: ${data["roll"]}, Yaw: ${data["yaw"]}"),
                              Text("Speedbreaker detected: ${data["speedbreaker"]}"),
                              // Text("Timestamp: ${data["timestamp"] != null ? data["timestamp"].toDate().toString() : "N/A"}"),
                            ],
                          ),
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
