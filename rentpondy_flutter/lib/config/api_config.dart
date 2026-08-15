/// Backend configuration mirrored from the web app's `.env`
/// (REACT_APP_API_URL) and the image host used in PropertyCard.
class ApiConfig {
  ApiConfig._();

  /// Base REST URL — same value as REACT_APP_API_URL.
  static const String baseUrl = 'https://rentpondy.com/PPC/PPC';

  /// Host that serves uploaded property photos. In the JSX:
  /// `https://rentpondy.com/PPC/${property.photos[0]}`.
  static const String imageHost = 'https://rentpondy.com/PPC/';

  /// AI assistant endpoint (REACT_APP_ASSISTANT_URL) — reserved for later.
  static const String assistantUrl = 'https://rentpondy.com/PPC/api/assistant';

  /// Build a full image URL from a stored photo path, normalising the
  /// backslashes / leading slashes exactly like the web app does.
  static String photoUrl(String rawPath) {
    final normalised =
        rawPath.replaceAll(r'\', '/').replaceFirst(RegExp(r'^/+'), '');
    return '$imageHost$normalised';
  }
}
