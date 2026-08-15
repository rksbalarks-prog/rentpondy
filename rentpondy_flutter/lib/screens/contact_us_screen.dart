import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';

/// "Contact Us" — the support form. Ports ContactUs.jsx
/// (`POST /contactUs { name, email, phoneNumber, message }`, 201 on success).
class ContactUsScreen extends StatefulWidget {
  const ContactUsScreen({super.key});

  @override
  State<ContactUsScreen> createState() => _ContactUsScreenState();
}

class _ContactUsScreenState extends State<ContactUsScreen> {
  static const supportPhone = '+91-8300622013';
  static const supportEmail = 'info.rentpondy@gmail.com';

  late final ApiService _api;

  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _messageCtrl = TextEditingController();

  bool _sending = false;

  @override
  void initState() {
    super.initState();
    final app = context.read<AppState>();
    _api = app.api;
    _phoneCtrl.text = app.phoneDigits;
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _messageCtrl.dispose();
    super.dispose();
  }

  void _toast(String msg, {bool error = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg),
      backgroundColor: error ? Colors.red : AppColors.primary,
      behavior: SnackBarBehavior.floating,
    ));
  }

  Future<void> _submit() async {
    if (_nameCtrl.text.trim().isEmpty ||
        _emailCtrl.text.trim().isEmpty ||
        _messageCtrl.text.trim().isEmpty) {
      _toast('Please fill name, email and message.', error: true);
      return;
    }
    setState(() => _sending = true);
    try {
      await _api.submitContactUs(
        name: _nameCtrl.text.trim(),
        email: _emailCtrl.text.trim(),
        phoneNumber: _phoneCtrl.text.trim(),
        message: _messageCtrl.text.trim(),
      );
      if (!mounted) return;
      _nameCtrl.clear();
      _emailCtrl.clear();
      _messageCtrl.clear();
      _toast('Contact form submitted successfully!');
    } catch (e) {
      _toast(e.toString(), error: true);
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  Future<void> _launch(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) await launchUrl(uri);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFFEFEFEF),
        elevation: 0,
        leading: const BackButton(color: AppColors.primary),
        title: const Text('Contact Us',
            style: TextStyle(fontSize: 18, color: Colors.black)),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 500),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Row(
                children: [
                  Expanded(
                    child: _quickAction(Icons.call, 'Call us', supportPhone,
                        () => _launch('tel:$supportPhone')),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _quickAction(Icons.email_outlined, 'Email us',
                        'Send a mail', () => _launch('mailto:$supportEmail')),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              const Text('Send us a message',
                  style:
                      TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 12),
              _field('Name', _nameCtrl, Icons.person_outline),
              const SizedBox(height: 12),
              _field('Email', _emailCtrl, Icons.email_outlined,
                  keyboard: TextInputType.emailAddress),
              const SizedBox(height: 12),
              _field('Phone Number', _phoneCtrl, Icons.phone_outlined,
                  keyboard: TextInputType.phone, maxLength: 10),
              const SizedBox(height: 12),
              _field('Message', _messageCtrl, Icons.chat_bubble_outline,
                  maxLines: 4),
              const SizedBox(height: 20),
              SizedBox(
                height: 48,
                child: ElevatedButton(
                  onPressed: _sending ? null : _submit,
                  child: Text(_sending ? 'Sending…' : 'SUBMIT',
                      style: const TextStyle(
                          fontWeight: FontWeight.w700, fontSize: 15)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _quickAction(
      IconData icon, String title, String subtitle, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
        decoration: BoxDecoration(
          color: AppColors.cardBodyBg,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFEEEEEE)),
        ),
        child: Column(
          children: [
            Icon(icon, color: AppColors.primary),
            const SizedBox(height: 6),
            Text(title,
                style: const TextStyle(
                    fontWeight: FontWeight.w600, fontSize: 13)),
            const SizedBox(height: 2),
            Text(subtitle,
                textAlign: TextAlign.center,
                style: const TextStyle(
                    fontSize: 11, color: AppColors.textMuted)),
          ],
        ),
      ),
    );
  }

  Widget _field(
    String label,
    TextEditingController controller,
    IconData icon, {
    TextInputType? keyboard,
    int maxLines = 1,
    int? maxLength,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboard,
      maxLines: maxLines,
      maxLength: maxLength,
      inputFormatters: keyboard == TextInputType.phone
          ? [FilteringTextInputFormatter.digitsOnly]
          : null,
      decoration: InputDecoration(
        labelText: label,
        counterText: '',
        prefixIcon: Icon(icon, color: AppColors.primary),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),
      ),
    );
  }
}
