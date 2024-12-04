import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Special Offer Banner */}
        <div className="mb-12 p-6 bg-[#00B5B4]/10 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-[#00B5B4] mb-2">
            Special Offer: Get 25% Off TrustedHousesitters
          </h3>
          <p className="text-gray-600 mb-4">
            Join the global community of pet lovers and get 25% off your
            membership
          </p>
          <a
            href="https://www.trustedhousesitters.com/refer/RAF693812/?utm_source=copy-link&utm_medium=refer-a-friend&utm_campaign=refer-a-friend"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#00B5B4] text-white rounded-full hover:bg-[#00A3A2] transition-colors"
          >
            Claim Your 25% Discount
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#00B5B4]">TrustedWriter</h3>
            <p className="text-gray-600 max-w-xs">
              Streamline your house-sitting applications with AI-powered
              personalization.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/settings"
                  className="text-gray-600 hover:text-[#00B5B4] transition-colors"
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-[#00B5B4] transition-colors"
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact/Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.trustedhousesitters.com/refer/RAF693812/?utm_source=copy-link&utm_medium=refer-a-friend&utm_campaign=refer-a-friend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#00B5B4] transition-colors"
                >
                  Join TrustedHousesitters
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/blbacelar/trustedwriter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#00B5B4] transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-12 pt-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} TrustedWriter. Not affiliated with
            TrustedHousesitters.
            <br />
            <span className="text-xs">
              Get 25% off your TrustedHousesitters membership using our{" "}
              <a
                href="https://www.trustedhousesitters.com/refer/RAF693812/?utm_source=copy-link&utm_medium=refer-a-friend&utm_campaign=refer-a-friend"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00B5B4] hover:underline"
              >
                referral link
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
