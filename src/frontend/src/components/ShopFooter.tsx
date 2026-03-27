import { Store } from "lucide-react";
import { SiGithub, SiInstagram, SiX } from "react-icons/si";

interface ShopFooterProps {
  onAdminClick: () => void;
}

export function ShopFooter({ onAdminClick }: ShopFooterProps) {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer
      className="mt-16 text-white/80"
      style={{ background: "oklch(0.26 0.07 230)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Store className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">ShopEase</div>
              <div className="text-xs text-white/50">Your one-stop shop</div>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-4 text-sm">
            {["About", "Help", "Contact", "Blog", "Terms"].map((link) => (
              <button
                type="button"
                key={link}
                className="hover:text-white transition-colors"
                data-ocid="footer.link"
              >
                {link}
              </button>
            ))}
            <button
              type="button"
              onClick={onAdminClick}
              className="hover:text-white transition-colors"
              data-ocid="footer.link"
            >
              Admin
            </button>
          </nav>

          {/* Social + copyright */}
          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex gap-3">
              <button
                type="button"
                className="hover:text-white transition-colors"
              >
                <SiX className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="hover:text-white transition-colors"
              >
                <SiInstagram className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="hover:text-white transition-colors"
              >
                <SiGithub className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-white/40">
              © {year}. Built with ❤️ using{" "}
              <a
                href={utm}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
