import 'package:flutter/material.dart';
import 'auth_service.dart';
import 'dashboard_screen.dart';

class AuthScreen extends StatefulWidget {
  @override
  _AuthScreenState createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final AuthService _authService = AuthService();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();

  bool isLogin = true;
  String? errorMessage;

  void _submit() async {
    String email = _emailController.text.trim();
    String password = _passwordController.text.trim();
    String fullName = _nameController.text.trim();

    String? error;
    if (isLogin) {
      error = await _authService.signIn(email, password);
    } else {
      error = await _authService.signUp(email, password, fullName);
    }

    if (error != null) {
      setState(() => errorMessage = error);
    } else {
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => DashboardScreen()));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(isLogin ? "Login" : "Sign Up")),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            if (!isLogin) TextField(controller: _nameController, decoration: InputDecoration(labelText: "Full Name")),
            TextField(controller: _emailController, decoration: InputDecoration(labelText: "Email")),
            TextField(controller: _passwordController, decoration: InputDecoration(labelText: "Password"), obscureText: true),
            if (errorMessage != null) Text(errorMessage!, style: TextStyle(color: Colors.red)),
            SizedBox(height: 20),
            ElevatedButton(onPressed: _submit, child: Text(isLogin ? "Login" : "Sign Up")),
            TextButton(
              onPressed: () => setState(() => isLogin = !isLogin),
              child: Text(isLogin ? "Create an account" : "Already have an account? Login"),
            ),
          ],
        ),
      ),
    );
  }
}
