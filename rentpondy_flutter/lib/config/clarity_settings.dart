/// Microsoft Clarity configuration for the mobile app.
///
/// This is a THIRD Clarity project, separate from the two web ones — Clarity
/// keeps mobile and web projects apart and will not accept mobile SDK data on a
/// web project ID. All three appear in the same dashboard:
///
///   y0kkzadc9b  admin panel  (web)
///   y12mjrlxxx  user site    (web)     ← replaced y0lgk0duzw on 2026-08-12
///   y0q3lj91r4  this app     (mobile)  ← configured below
///
/// Leave [projectId] empty to switch Clarity off completely — the SDK is never
/// initialised, no session is captured and every helper in ClarityService
/// becomes a no-op. Useful for local development so test taps never land in
/// production data.
///
/// Named ClaritySettings rather than ClarityConfig because the SDK already
/// exports a class by that name.
class ClaritySettings {
  ClaritySettings._();

  /// Clarity mobile project ID. Empty string disables Clarity entirely.
  static const String projectId = 'y0q3lj91r4';

  static bool get enabled => projectId.isNotEmpty;
}
