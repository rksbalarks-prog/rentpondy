import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../l10n/l10n_ext.dart';
import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';

/// "My Profile" — name / email / address against the signed-in mobile number.
/// Ports MyProfile.jsx:
///   GET  /profile/mobile/:phone   (404 -> create mode)
///   POST /profile-create
///   PUT  /profile/:mobile
class MyProfileScreen extends StatefulWidget {
  const MyProfileScreen({super.key});

  @override
  State<MyProfileScreen> createState() => _MyProfileScreenState();
}

class _MyProfileScreenState extends State<MyProfileScreen> {
  late final ApiService _api;
  late final String _phone;

  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();

  bool _loading = true;
  bool _saving = false;
  String? _error;

  /// False until a profile exists — drives create vs update.
  bool _isEditing = false;

  @override
  void initState() {
    super.initState();
    final app = context.read<AppState>();
    _api = app.api;
    _phone = app.phoneNumber ?? '';
    _load();
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _addressCtrl.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final profile = await _api.fetchProfile(_phone);
      if (!mounted) return;
      setState(() {
        if (profile != null) {
          _nameCtrl.text = profile['name']?.toString() ?? '';
          _emailCtrl.text = profile['email']?.toString() ?? '';
          _addressCtrl.text = profile['address']?.toString() ?? '';
          _isEditing = true;
        } else {
          _isEditing = false;
        }
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  void _toast(String msg, {bool error = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg),
      backgroundColor: error ? Colors.red : AppColors.primary,
      behavior: SnackBarBehavior.floating,
    ));
  }

  Future<void> _save() async {
    final name = _nameCtrl.text.trim();
    final email = _emailCtrl.text.trim();
    final address = _addressCtrl.text.trim();

    if (name.isEmpty || email.isEmpty || address.isEmpty) {
      _toast(context.trRead('profile.fillAll'), error: true);
      return;
    }

    setState(() => _saving = true);
    try {
      if (_isEditing) {
        await _api.updateProfile(
            mobile: _phone, name: name, email: email, address: address);
        if (mounted) _toast(context.trRead('profile.updated'));
      } else {
        await _api.createProfile({
          'name': name,
          'email': email,
          'address': address,
          'mobile': _phone,
        });
        if (mounted) setState(() => _isEditing = true);
        if (mounted) _toast(context.trRead('profile.created'));
      }
    } catch (e) {
      _toast(e.toString(), error: true);
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  String get _initial {
    final n = _nameCtrl.text.trim();
    return n.isEmpty ? '?' : n[0].toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFFEFEFEF),
        elevation: 0,
        leading: const BackButton(color: AppColors.primary),
        title: Text(context.tr('title.myProfile'),
            style: const TextStyle(fontSize: 18, color: Colors.black)),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 500),
          child: _body(),
        ),
      ),
    );
  }

  Widget _body() {
    if (_loading) {
      return const Center(
          child: CircularProgressIndicator(color: AppColors.primary));
    }
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_error!, textAlign: TextAlign.center),
            const SizedBox(height: 12),
            OutlinedButton(
                onPressed: _load, child: Text(context.tr('common.retry'))),
          ],
        ),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Center(
          child: Container(
            width: 90,
            height: 90,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [AppColors.primary, Color(0xFF764BA2)],
              ),
            ),
            child: Center(
              child: Text(_initial,
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 38,
                      fontWeight: FontWeight.w700)),
            ),
          ),
        ),
        const SizedBox(height: 10),
        Center(
          child: Text(_phone,
              style: const TextStyle(
                  color: AppColors.textGrey, fontWeight: FontWeight.w600)),
        ),
        const SizedBox(height: 4),
        Center(
          child: Text(
            _isEditing
                ? context.tr('profile.updateDetails')
                : context.tr('profile.createProfile'),
            style:
                const TextStyle(color: AppColors.textMuted, fontSize: 13),
          ),
        ),
        const SizedBox(height: 24),
        _field(context.tr('profile.name'), _nameCtrl, Icons.person_outline),
        const SizedBox(height: 14),
        _field(context.tr('profile.email'), _emailCtrl, Icons.email_outlined,
            keyboardType: TextInputType.emailAddress),
        const SizedBox(height: 14),
        _field(context.tr('profile.address'), _addressCtrl, Icons.home_outlined,
            maxLines: 3),
        const SizedBox(height: 24),
        SizedBox(
          height: 48,
          child: ElevatedButton(
            onPressed: _saving ? null : _save,
            child: Text(
              _saving
                  ? context.tr('profile.saving')
                  : (_isEditing
                      ? context.tr('profile.updateBtn')
                      : context.tr('profile.createBtn')),
              style: const TextStyle(
                  fontWeight: FontWeight.w700, fontSize: 15),
            ),
          ),
        ),
      ],
    );
  }

  Widget _field(
    String label,
    TextEditingController controller,
    IconData icon, {
    TextInputType? keyboardType,
    int maxLines = 1,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      maxLines: maxLines,
      onChanged: (_) {
        // Keep the avatar initial in sync with the name field.
        if (identical(controller, _nameCtrl)) setState(() {});
      },
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: AppColors.primary),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),
      ),
    );
  }
}
