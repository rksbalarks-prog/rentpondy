import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../constants/assets.dart';
import '../l10n/l10n_ext.dart';
import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/language_toggle.dart';

/// Phone + OTP login. Ports the active Login.jsx flow: enter a mobile number,
/// receive an OTP (India / +91 flow), verify, then land on the home shell.
/// Admin-whitelisted numbers skip OTP (direct-verified).
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phoneCtrl = TextEditingController();
  final _otpCtrl = TextEditingController();

  bool _otpSent = false;
  bool _loading = false;
  int _timer = 30;
  Timer? _ticker;

  ApiService get _api => context.read<AppState>().api;

  @override
  void dispose() {
    _phoneCtrl.dispose();
    _otpCtrl.dispose();
    _ticker?.cancel();
    super.dispose();
  }

  void _startTimer() {
    _timer = 30;
    _ticker?.cancel();
    _ticker = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) return;
      setState(() {
        if (_timer > 0) {
          _timer--;
        } else {
          t.cancel();
        }
      });
    });
  }

  void _toast(String msg, {bool error = false}) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg),
      backgroundColor: error ? AppColors.danger : AppColors.primary,
      behavior: SnackBarBehavior.floating,
    ));
  }

  Future<void> _sendOtp() async {
    final phone = _phoneCtrl.text.trim();
    if (phone.length != 10) {
      _toast(context.trRead('login.invalidPhone'), error: true);
      return;
    }
    setState(() => _loading = true);
    try {
      // Admin-whitelisted numbers skip OTP entirely.
      if (await _api.isDirectVerified(phone)) {
        if (!mounted) return;
        await context.read<AppState>().login(phone);
        return; // AuthGate swaps to the home shell.
      }
      await _api.sendOtp(phone);
      if (!mounted) return;
      setState(() {
        _otpSent = true;
        _loading = false;
      });
      _startTimer();
      _toast(context.trRead('login.otpSentToast'));
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _showFailure(e.toString());
    }
  }

  Future<void> _verifyOtp() async {
    final otp = _otpCtrl.text.trim();
    if (otp.isEmpty) {
      _toast(context.trRead('login.enterOtpErr'), error: true);
      return;
    }
    setState(() => _loading = true);
    try {
      await _api.verifyOtp(_phoneCtrl.text.trim(), otp);
      if (!mounted) return;
      await context.read<AppState>().login(_phoneCtrl.text.trim());
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _showFailure(e.toString());
    }
  }

  Future<void> _resend() async {
    if (_timer > 0) return;
    try {
      await _api.sendOtp(_phoneCtrl.text.trim());
      if (!mounted) return;
      _startTimer();
      _toast(context.trRead('login.otpResent'));
    } catch (e) {
      if (!mounted) return;
      _showFailure(e.toString());
    }
  }

  void _showFailure(String message) {
    final failedTitle = context.trRead('login.failed');
    final tryAgain = context.trRead('login.tryAgain');
    showDialog(
      context: context,
      builder: (_) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: const EdgeInsets.all(30),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('❌', style: TextStyle(fontSize: 48)),
              const SizedBox(height: 16),
              Text(failedTitle,
                  style: const TextStyle(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w700,
                      fontSize: 20)),
              const SizedBox(height: 12),
              Text(message,
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: AppColors.textGrey)),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: Text(tryAgain),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 470),
          child: _otpSent ? _buildOtpView() : _buildPhoneView(),
        ),
      ),
    );
  }

  // ---- Phone entry ----
  Widget _buildPhoneView() {
    return Container(
      decoration: const BoxDecoration(
        image: DecorationImage(
          image: AssetImage(Assets.loginBg),
          fit: BoxFit.cover,
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            children: [
              const SizedBox(height: 24),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(context.tr('login.welcomeBack'),
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 30,
                                fontWeight: FontWeight.bold)),
                        Text(context.tr('login.loginToContinue'),
                            style: const TextStyle(color: Color(0xFF989EA0))),
                      ],
                    ),
                  ),
                  const LanguageToggle(onSurface: true),
                ],
              ),
              const Spacer(),
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.asset(Assets.logo, height: 100, width: 100),
              ),
              const SizedBox(height: 8),
              const Text('Rent Pondy',
                  style: TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 32,
                      color: AppColors.primary,
                      letterSpacing: 1.5)),
              const SizedBox(height: 2),
              Text(context.tr('login.tagline'),
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.white, fontSize: 16)),
              const SizedBox(height: 20),
              _phoneField(),
              const SizedBox(height: 12),
              SizedBox(
                width: 180,
                height: 46,
                child: ElevatedButton(
                  onPressed: _loading ? null : _sendOtp,
                  style: ElevatedButton.styleFrom(
                    backgroundColor:
                        _loading ? Colors.grey : AppColors.primary,
                    side: const BorderSide(color: AppColors.primary, width: 2),
                  ),
                  child: Text(
                      _loading
                          ? context.tr('login.loggingIn')
                          : context.tr('login.loginBtn'),
                      style: const TextStyle(
                          fontWeight: FontWeight.w700, fontSize: 16)),
                ),
              ),
              const Spacer(),
              Text.rich(
                TextSpan(
                  text: context.tr('login.editOrAdd'),
                  style: const TextStyle(color: Colors.white),
                  children: const [
                    TextSpan(
                      text: 'Rent Pondy',
                      style: TextStyle(
                          color: Color(0xFF16C616),
                          fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Container(
                width: 140,
                height: 2,
                color: AppColors.orangeRed,
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _phoneField() {
    return Container(
      constraints: const BoxConstraints(maxWidth: 360),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F5F5),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            decoration: const BoxDecoration(
              border: Border(right: BorderSide(color: Color(0xFFE0E0E0))),
            ),
            child: const Row(
              children: [
                Text('🇮🇳', style: TextStyle(fontSize: 16)),
                SizedBox(width: 6),
                Text('+91',
                    style: TextStyle(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w600)),
              ],
            ),
          ),
          Expanded(
            child: TextField(
              controller: _phoneCtrl,
              keyboardType: TextInputType.phone,
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly,
                LengthLimitingTextInputFormatter(10),
              ],
              style: const TextStyle(
                  color: Color(0xFF222222), fontWeight: FontWeight.w600),
              decoration: InputDecoration(
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 14),
                hintText: context.tr('login.mobileHint'),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ---- OTP entry ----
  Widget _buildOtpView() {
    return Container(
      color: Colors.white,
      child: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              Container(
                height: 260,
                width: double.infinity,
                color: const Color(0xFFFEFF7F),
                child: Image.asset(Assets.otpBanner, fit: BoxFit.cover),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('${context.tr('login.loginNumber')} ${_phoneCtrl.text}',
                      style: const TextStyle(color: AppColors.orangeRed)),
                  IconButton(
                    onPressed: () => setState(() => _otpSent = false),
                    icon: const Icon(Icons.edit,
                        color: AppColors.primary, size: 22),
                  ),
                ],
              ),
              Text(context.tr('login.otpSentMobile'),
                  style: const TextStyle(color: Colors.grey)),
              const SizedBox(height: 24),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: TextField(
                  controller: _otpCtrl,
                  keyboardType: TextInputType.number,
                  textAlign: TextAlign.center,
                  inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                  style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF474747),
                      fontSize: 18,
                      letterSpacing: 4),
                  decoration: InputDecoration(
                    hintText: context.tr('login.enterOtp'),
                    hintStyle: const TextStyle(
                        color: Colors.grey, letterSpacing: 0, fontSize: 15),
                    enabledBorder: const UnderlineInputBorder(
                        borderSide: BorderSide(color: Color(0xFF474747))),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: SizedBox(
                  width: double.infinity,
                  height: 46,
                  child: ElevatedButton(
                    onPressed: _loading ? null : _verifyOtp,
                    style: ElevatedButton.styleFrom(
                      backgroundColor:
                          _loading ? Colors.grey : AppColors.primary,
                    ),
                    child: Text(
                        _loading
                            ? context.tr('login.verifying')
                            : context.tr('login.verifyOtp'),
                        style: const TextStyle(fontWeight: FontWeight.w700)),
                  ),
                ),
              ),
              const SizedBox(height: 10),
              if (_timer > 0)
                Text(
                    context.tr('login.resendIn').replaceFirst('{s}', '$_timer'),
                    style: const TextStyle(color: AppColors.textGrey))
              else
                TextButton(
                  onPressed: _resend,
                  child: Text(context.tr('login.resendOtp'),
                      style: const TextStyle(color: AppColors.primary)),
                ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
