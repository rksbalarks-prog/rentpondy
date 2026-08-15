import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

/// Frequently Asked Questions. Content is transcribed verbatim from the
/// `faqData` array in FAQ.jsx (it is hardcoded there, not CMS-driven), so any
/// wording change must be made in both places.
class FaqScreen extends StatelessWidget {
  const FaqScreen({super.key});

  static const _faq = <(String, List<(String, String)>)>[
    (
      'General Questions',
      [
        (
          'What is the Pondy Property App?',
          'The Property App is a mobile/web application designed to help users buy, sell, or manage properties. It provides real estate listings, virtual tours, mortgage calculators, and agent connections.'
        ),
        (
          'Is the app free to use?',
          'Yes, the basic features (browsing listings, saving favourites, and contacting agents) are free. Some premium features (e.g., advanced filters, priority listings) may require a subscription.'
        ),
        (
          'Which platforms is the app available on?',
          'The app is available for Android (Google Play). A web version is also accessible via browser www.ppcpondy.com. iOS (App Store) is under development.'
        ),
      ]
    ),
    (
      'Account & Registration',
      [
        (
          'How do I create an account?',
          'You can sign up using your phone number and verify using OTP.'
        ),
        (
          'Can I use the app without an account?',
          'No, you can’t browse listings, but a Verified account is required to save favorites, contact agents, or post properties.'
        ),
      ]
    ),
    (
      'Property Listings',
      [
        (
          'How do I search for properties?',
          'Use filters like location, price range, property type (house, apartment, land), bedrooms, and amenities to refine your search.'
        ),
        (
          'Are the listings verified?',
          'We strive to verify listings, but we recommend visiting properties in person or consulting an agent before making decisions.'
        ),
        (
          'Can I save properties to view later?',
          'Yes, tap the heart (❤️) icon to save properties to your Favorites list.'
        ),
        (
          'How do I report a fake or suspicious listing?',
          'Click the "Report Listing" button on the property page or contact our support team.'
        ),
      ]
    ),
    (
      'Buying, Selling & Renting',
      [
        (
          'How do I list my property for sale/rent?',
          'Go to "Post a Property", fill in details, upload photos, and submit for approval.'
        ),
        (
          'Are there fees for listing a property?',
          'Basic listings are free, but featured listings (higher visibility) may have a fee.'
        ),
        (
          'How do I contact a seller/agent?',
          'Tap "Contact Agent" on the property page to call, message, or email/call them directly.'
        ),
        (
          'Can I negotiate the price through the app?',
          'Yes, you can message through the OFFER BUTTON to the seller/agent to discuss pricing and terms.'
        ),
      ]
    ),
    (
      'Payments & Security',
      [
        (
          'Is my payment information secure?',
          'Yes, we use encrypted payment gateways and do not store your card details.'
        ),
        (
          'What payment methods are accepted?',
          'Credit/debit cards, bank transfers, UPI and digital wallets (Apple Pay, Google Pay, etc.).'
        ),
      ]
    ),
    (
      'Technical Support',
      [
        (
          'The app is crashing. What should I do?',
          'Try restarting the app, updating it, or reinstalling. If issues persist, contact support.'
        ),
        (
          'How do I update my app?',
          'Visit Google Play (Android) and check for updates.'
        ),
        (
          'How can I delete my account?',
          'Go to Settings > Account > Delete Account (data will be permanently removed).'
        ),
      ]
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFFEFEFEF),
        elevation: 0,
        leading: const BackButton(color: AppColors.primary),
        title: const Text('FAQ',
            style: TextStyle(fontSize: 18, color: Colors.black)),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 500),
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
            children: [
              const Text('Frequently Asked Questions (FAQ)',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 20),
              for (final (category, items) in _faq) ...[
                Text(category,
                    style: const TextStyle(
                        color: Color(0xFF004E9D),
                        fontSize: 17,
                        fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                for (final (q, a) in items)
                  Theme(
                    // Remove the default divider lines for a cleaner list.
                    data: Theme.of(context)
                        .copyWith(dividerColor: Colors.transparent),
                    child: ExpansionTile(
                      tilePadding: EdgeInsets.zero,
                      childrenPadding:
                          const EdgeInsets.only(bottom: 10, right: 8),
                      expandedCrossAxisAlignment:
                          CrossAxisAlignment.start,
                      title: Text(q,
                          style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textBlack)),
                      children: [
                        Text(a,
                            style: const TextStyle(
                                fontSize: 13.5,
                                height: 1.5,
                                color: AppColors.textGrey)),
                      ],
                    ),
                  ),
                const SizedBox(height: 18),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
