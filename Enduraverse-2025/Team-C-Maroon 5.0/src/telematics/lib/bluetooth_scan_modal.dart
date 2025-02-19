import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'bluetooth_device_page.dart'; // Import the Bluetooth device page

void showScanModal(BuildContext context) {
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.grey[900],
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    isScrollControlled: true, // Allows for custom height
    builder: (context) {
      return _ScanResultsWidget();
    },
  );
}

class _ScanResultsWidget extends StatefulWidget {
  @override
  _ScanResultsWidgetState createState() => _ScanResultsWidgetState();
}

class _ScanResultsWidgetState extends State<_ScanResultsWidget> {
  List<ScanResult> scanResults = [];

  @override
  void initState() {
    super.initState();
    _startScan();
  }

  void _startScan() {
    FlutterBluePlus.startScan(timeout: const Duration(seconds: 5));
    FlutterBluePlus.scanResults.listen((results) {
      if (mounted) {
        setState(() {
          scanResults = results;
        });
      }
    });
  }

  @override
  void dispose() {
    FlutterBluePlus.stopScan(); // Stop scanning when modal is closed
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.6, // 60% height of screen
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            "Scanned Devices",
            style: TextStyle(fontSize: 18, color: Colors.white),
          ),
          const Divider(color: Colors.grey),
          scanResults.isEmpty
              ? const Padding(
            padding: EdgeInsets.all(20.0),
            child: Text(
              "No devices found",
              style: TextStyle(color: Colors.grey),
            ),
          )
              : Expanded(
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: scanResults.length,
              itemBuilder: (context, index) {
                final device = scanResults[index].device;
                return ListTile(
                  title: Text(
                    device.name.isNotEmpty ? device.name : "Unknown Device",
                    style: const TextStyle(color: Colors.white),
                  ),
                  subtitle: Text(
                    device.remoteId.str,
                    style: const TextStyle(color: Colors.grey),
                  ),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            BluetoothDevicePage(device: device),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
